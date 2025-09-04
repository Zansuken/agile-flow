import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

interface RouteParams {
  projectId?: string;
  taskId?: string;
  [key: string]: string | undefined;
}

interface PageTitleConfig {
  [key: string]: string | ((params: RouteParams) => string);
}

const pageTitles: PageTitleConfig = {
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/projects/:projectId': (params: RouteParams) =>
    `Project Details - ${params.projectId}`,
  '/projects/:projectId/team': (params: RouteParams) =>
    `Team Management - ${params.projectId}`,
  '/projects/:projectId/settings': (params: RouteParams) =>
    `Project Settings - ${params.projectId}`,
  '/projects/:projectId/kanban': (params: RouteParams) =>
    `Kanban Board - ${params.projectId}`,
  '/projects/:projectId/tasks': (params: RouteParams) =>
    `Tasks - ${params.projectId}`,
  '/projects/:projectId/tasks/:taskId': (params: RouteParams) =>
    `Task Details - ${params.taskId}`,
  '/projects/:projectId/sprints': (params: RouteParams) =>
    `Sprints - ${params.projectId}`,
};

export const usePageTitle = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Find matching route pattern
    const currentPath = location.pathname;
    let title = 'AgileFlow';

    // Try exact match first
    if (pageTitles[currentPath]) {
      const titleConfig = pageTitles[currentPath];
      title =
        typeof titleConfig === 'function' ? titleConfig(params) : titleConfig;
    } else {
      // Try pattern matching for dynamic routes
      for (const [pattern, titleConfig] of Object.entries(pageTitles)) {
        const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');

        if (regex.test(currentPath)) {
          title =
            typeof titleConfig === 'function'
              ? titleConfig(params)
              : titleConfig;
          break;
        }
      }
    }

    // Update document title
    document.title = `${title} | AgileFlow`;
  }, [location.pathname, params]);

  return location.pathname;
};
