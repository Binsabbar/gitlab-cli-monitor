/* eslint-disable no-unused-vars */

class ProjectMonitorService {
  constructor({ gitlabClient, pipelineMonitorService, jobMonitorService }) {
    this.client = gitlabClient;
    this.pipelineService = pipelineMonitorService;
    this.jobService = jobMonitorService;
  }

  doesProjectExist({ project }) {
    const { id: projectId } = project;
    return this.client.getProject({ projectId })
      .then((_) => true)
      .catch((error) => {
        if (error.status === 404) return false;
        return Promise.reject(error);
      });
  }

  getJobs({ project }) {
    return this.pipelineService.getPipelines({ project })
      .then((pipelines) => {
        const promises = [];
        pipelines.forEach((pipeline) => {
          promises.push(this.jobService.getJobs({ project, pipeline }));
        });
        return Promise.all(promises).then((values) => values.flat());
      });
  }
}

exports.ProjectMonitorService = ProjectMonitorService;
