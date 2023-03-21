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
import * as rolesApi from "../api/roles";
import * as teamsApi from "../api/teams";
import useAuth from "./useAuth";
import _ from "lodash";

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
  const [rolesList, setRolesList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [userTeams, setUserTeams] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setLoadingInitial(true);

      const fetchData = async () => {
        try {
          const projects = await projectsApi.getAllProjects();
          setProjectsList(projects);

          const projectsMembers = await projectsApi.getAllProjectsAssignees(
            projects.map((project) => project.projectId)
          );
          setProjectsMembersObj(projectsMembers);

          const tasks = await tasksApi.getAllTasks();
          let updatedList = [...tasks];
          const ids = tasks.map((task) => task.taskId);
          if (ids.length) {
            const taskAssignees = await tasksApi.getTaskAssignees(ids);
            taskAssignees.forEach((elem) => {
              let taskId = Object.keys(elem)[0];
              let index = tasks.findIndex((task) => task.taskId === taskId);
              updatedList[index] = {
                ...updatedList[index],
                assignees: Object.values(elem)[0],
              };
            });
          }
          setTasksList(updatedList);

          const roles = await rolesApi.getAllRoles();
          setRolesList(roles);

          const teams = await teamsApi.getAllTeams();
          setTeamsList(teams);

          setLoadingInitial(false);
        } catch (error) {
          setError(error);
        }
      };
      fetchData();
    } else {
      setLoadingInitial(false);
    }
  }, [user]);

  useEffect(() => {
    let teams = [];
    if (teamsList) {
      teams = teamsList
        .map((team) => {
          let filtered = team.members.filter(
            (member) =>
              member.memberId._id === user.userId &&
              member.status !== "notMember"
          );
          if (filtered.length > 0) {
            return team;
          }
        })
        .filter((team) => team !== undefined);
    }
    setUserTeams([...teams]);
  }, [teamsList]);

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

  // function getAllProjectAssignees(projectId) {
  //   setLoading(true);

  //   return projectsApi
  //     .getAllProjectAssignees(projectId)
  //     .then((members) => {
  //       console.log("Members: " + JSON.stringify(members));
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     })
  //     .finally(() => setLoading(false));
  // }

  function createProject(params) {
    setLoading(true);

    return projectsApi
      .createProject(params)
      .then((project) => {
        console.log("api res: " + JSON.stringify(project));

        const updatedData = [...projectsList];
        updatedData.push(project);

        setProjectsList(updatedData);
        return project.projectId;
      })
      .catch((error) => {
        setError(error);
        throw error;
      })
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
      .catch((error) => {
        setError(error);
        throw error;
      })
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
      .catch((error) => {
        setError(error);
        throw error;
      })
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

        // TODO - push assign user before setting list
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
        // console.log("api res: " + JSON.stringify(task));
        // console.log(
        //   "local val: " +
        //     JSON.stringify(
        //       tasksList[tasksList.findIndex((o) => o.taskId === task.taskId)]
        //     )
        // );
        const updatedData = [...tasksList];
        const index = updatedData.findIndex((o) => o.taskId === task.taskId);
        // console.log(index);
        updatedData[index] = { ...updatedData[index], ...task };
        // console.log("api: ", updatedData[index], task);
        setTasksList(updatedData);
        return task;
      })
      .catch((error) => {
        setError(error);
        throw error;
      })
      .finally(() => setLoading(false));
  }

  function deleteTask(params) {
    setLoading(true);

    return tasksApi
      .deleteTask(params)
      .then((task) => {
        let updatedData = [...tasksList];
        const index = updatedData.findIndex((o) => o.taskId === task._id);
        updatedData.splice(index, 1);

        setTasksList(updatedData);
      })
      .catch((error) => setError(error))
      .then(() => setLoading(false));
  }

  function getAllRoles() {
    setLoading(true);

    rolesApi
      .getAllRoles()
      .then((roles) => {
        setRolesList(roles);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function getAllTeams() {
    setLoading(true);

    teamsApi
      .getAllTeams()
      .then((teams) => {
        setTeamsList(teams);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function createTeam(params) {
    setLoading(true);

    return teamsApi
      .createTeam(params)
      .then((team) => {
        console.log("api res: " + JSON.stringify(team));

        const updatedData = [...teamsList];
        updatedData.push(team);

        setTeamsList(updatedData);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function addTeamMember(params) {
    setLoading(true);

    return teamsApi
      .addTeamMember(params)
      .then((team) => {
        console.log("api res: " + JSON.stringify(team));

        const oldIndex = teamsList.findIndex((t) => t._id === team._id);
        const updatedData = [...teamsList];
        updatedData[oldIndex] = team;

        setTeamsList(updatedData);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function updateTeamMember(params) {
    setLoading(true);

    return teamsApi
      .updateTeamMember(params)
      .then((team) => {
        console.log("api res: " + JSON.stringify(team));

        const oldIndex = teamsList.findIndex((t) => t._id === team._id);
        const updatedData = [...teamsList];
        updatedData[oldIndex] = team;

        setTeamsList(updatedData);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function removeTeamMember(params) {
    setLoading(true);

    return teamsApi
      .removeTeamMember(params)
      .then((team) => {
        console.log("api res: " + JSON.stringify(team));
        //TODO - careful with deleted empty teams in future versions
        const oldIndex = teamsList.findIndex((t) => t._id === team._id);
        const updatedData = [...teamsList];
        updatedData[oldIndex] = team;

        setTeamsList(updatedData);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function assignUserToProject(params) {
    setLoading(true);

    return projectsApi
      .assignUserToProject(params)
      .then((newMember) => {
        const obj = projectsMembersObj;
        obj[newMember.projectId].push(newMember);

        setProjectsMembersObj(obj);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function unassignUserFromProject(params) {
    setLoading(true);

    return projectsApi
      .unassignUserFromProject(params)
      .then((resp) => {
        if (resp.msg.includes("no longer")) {
          let obj = projectsMembersObj;

          const x = _.at(obj, params.projectId)[0];

          // using User Email only
          const y = _.filter(x, (user) => user.email !== params.memberEmail);

          obj[params.projectId] = y;
          console.log(obj);

          setProjectsMembersObj(obj);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function assignUserToTask(params) {
    setLoading(true);

    return tasksApi
      .assignUserToTask(params)
      .then((assignee) => {
        const index = _.findIndex(tasksList, (task) =>
          _.includes(task, assignee.taskId)
        );
        const updatedlist = [...tasksList];
        updatedlist[index].assignees.push(assignee);
        setTasksList(updatedlist);
        return assignee;
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function unassignUserFromTask(params) {
    setLoading(true);

    return tasksApi
      .unassignUserFromTask(params)
      .then((resp) => {
        if (resp.msg.includes("no longer")) {
          const index = _.findIndex(tasksList, (task) =>
            _.includes(task, params.taskId)
          );
          const updatedlist = [...tasksList];
          const filtered = [...updatedlist[index].assignees].filter(
            (assignee) => {
              console.log(assignee);
              return assignee.email !== params.assigneeEmail;
            }
          );
          console.log(filtered);
          updatedlist[index].assignees = [...filtered];
          setTasksList(updatedlist);
          return resp;
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  const memoedValue = useMemo(
    () => ({
      projectsList,
      projectsMembersObj,
      tasksList,
      rolesList,
      teamsList,
      userTeams,
      loading,
      loadingInitial,
      error,
      getAllProjects,
      getProject,
      // getAllProjectAssignees,
      createProject,
      updateProject,
      deleteProject,
      getAllTasks,
      createTask,
      updateTask,
      deleteTask,
      getAllRoles,
      getAllTeams,
      createTeam,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      assignUserToProject,
      unassignUserFromProject,
      assignUserToTask,
      unassignUserFromTask,
    }),
    [
      projectsList,
      tasksList,
      projectsMembersObj,
      userTeams,
      rolesList,
      teamsList,
      loading,
      error,
    ]
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
