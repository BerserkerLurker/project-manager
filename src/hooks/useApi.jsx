import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as projectsApi from "../api/projects";
import * as tasksApi from "../api/tasks";
import useAuth from "./useAuth";

const ApiContext = createContext({});

export default function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider(children) {
  // @ts-ignore
  const { user } = useAuth();
  const [projectsList, setProjectsList] = useState([]);
  const [projectsMembersObj, setProjectsMembersObj] = useState({});
  const [tasksList, setTasksList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    if (user !== undefined) {
      setLoadingInitial(true);
      projectsApi
        .getAllProjects()
        .then((projects) => {
          setProjectsList(projects);

          projectsApi
            .getAllProjectsAssignees(
              projects.map((project) => project.projectId)
            )
            .then((projectsMembers) => {
              // console.log(projectsMembers);
              setProjectsMembersObj(projectsMembers);
            })
            .catch((error) => setError(error))
            .finally(() => setLoadingInitial(false));
        })
        .catch((error) => setError(error))
        .finally(() => setLoadingInitial(false));

      tasksApi
        .getAllTasks()
        .then((tasks) => {
          setTasksList(tasks);
        })
        .catch((error) => setError(error))
        .finally(() => setLoadingInitial(false));
    } else {
      setLoadingInitial(false);
    }
  }, [user]);

  function getAllProjects() {
    setLoading(true);

    projectsApi
      .getAllProjects()
      .then((projects) => {
        setProjectsList(projects);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function getProject(id) {
    setLoading(true);

    return projectsApi
      .getProject(id)
      .then((project) => {
        console.log("api res: " + JSON.stringify(project));
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function createProject(params) {
    setLoading(true);

    return projectsApi
      .createProject(params)
      .then((project) => {
        console.log("api res: " + JSON.stringify(project));

        const updatedData = [...projectsList];
        updatedData.push(project);

        setProjectsList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function updateProject(params) {
    setLoading(true);

    return projectsApi
      .updateProject(params)
      .then((project) => {
        console.log("api res: " + JSON.stringify(project));
        console.log(
          "local val: " +
            JSON.stringify(
              projectsList[
                projectsList.findIndex((o) => o.projectId === project.projectId)
              ]
            )
        );
        const updatedData = [...projectsList];
        updatedData[
          updatedData.findIndex((o) => o.projectId === project.projectId)
        ] = project;
        setProjectsList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function deleteProject(id) {
    setLoading(true);

    return projectsApi
      .deleteProject(id)
      .then(() => {
        console.log(
          "local val: " +
            JSON.stringify(
              projectsList[projectsList.findIndex((o) => o.projectId === id)]
            )
        );
        const updatedData = [...projectsList];
        updatedData.splice(
          projectsList.findIndex((o) => o.projectId === id),
          1
        );
        setProjectsList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function getAllTasks() {
    setLoading(true);

    tasksApi
      .getAllTasks()
      .then((tasks) => {
        setTasksList(tasks);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function createTask(params) {
    setLoading(true);

    return tasksApi
      .createTask(params)
      .then((task) => {
        console.log("api res: " + JSON.stringify(task));

        const updatedData = [...tasksList];
        updatedData.push(task);

        setTasksList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function updateTask(params) {
    setLoading(true);

    return tasksApi
      .updateTask(params)
      .then((task) => {
        console.log("api res: " + JSON.stringify(task));
        console.log(
          "local val: " +
            JSON.stringify(
              tasksList[tasksList.findIndex((o) => o.taskId === task.taskId)]
            )
        );
        const updatedData = [...tasksList];
        updatedData[updatedData.findIndex((o) => o.taskId === task.taskId)] =
          task;
        setTasksList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  const memoedValue = useMemo(
    () => ({
      projectsList,
      projectsMembersObj,
      tasksList,
      loading,
      loadingInitial,
      error,
      getAllProjects,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      getAllTasks,
      createTask,
      updateTask,
    }),
    [projectsList, tasksList, projectsMembersObj, loading, error]
  );
  return (
    <ApiContext.Provider value={memoedValue}>
      {loadingInitial ? "loading" : toArray(children.children)}
    </ApiContext.Provider>
  );
}

function toArray(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  return [items];
}
