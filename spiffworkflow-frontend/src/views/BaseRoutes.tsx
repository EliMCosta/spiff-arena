import React, { useState, lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Route, Routes } from 'react-router';
import '../assets/styles/transitions.css';
import { UiSchemaUxElement } from '../extension_ui_schema_interfaces';
import { extensionUxElementMap } from '../components/ExtensionUxElementForDisplay';
import ErrorDisplay from '../components/ErrorDisplay';

// Lazy-loaded components
const Homepage = lazy(() => import('./Homepage'));
const Processes = lazy(() => import('./StartProcess/Processes'));
const StartProcessInstance = lazy(() => import('./StartProcess/StartProcessInstance'));
const InstancesStartedByMe = lazy(() => import('./InstancesStartedByMe'));
const TaskShow = lazy(() => import('./TaskShow/TaskShow'));
const ProcessInterstitialPage = lazy(() => import('./TaskShow/ProcessInterstitialPage'));
const ProcessInstanceProgressPage = lazy(() => import('./TaskShow/ProcessInstanceProgressPage'));
const About = lazy(() => import('./About'));
const MessageListPage = lazy(() => import('./MessageListPage'));
const DataStoreRoutes = lazy(() => import('./DataStoreRoutes'));
const Configuration = lazy(() => import('./Configuration'));
const AuthenticationList = lazy(() => import('./AuthenticationList'));
const SecretList = lazy(() => import('./SecretList'));
const SecretNew = lazy(() => import('./SecretNew'));
const SecretShow = lazy(() => import('./SecretShow'));
const ProcessModelShow = lazy(() => import('./ProcessModelShow'));
const ProcessModelNew = lazy(() => import('./ProcessModelNew'));
const ProcessModelEdit = lazy(() => import('./ProcessModelEdit'));
const ProcessModelEditDiagram = lazy(() => import('./ProcessModelEditDiagram'));
const ReactFormEditor = lazy(() => import('./ReactFormEditor'));
const ProcessInstanceRoutes = lazy(() => import('./ProcessInstanceRoutes'));
const ProcessInstanceShortLink = lazy(() => import('./ProcessInstanceShortLink'));
const Extension = lazy(() => import('./Extension'));
const ProcessGroupNew = lazy(() => import('./ProcessGroupNew'));
const ProcessGroupEdit = lazy(() => import('./ProcessGroupEdit'));
const ProcessModelNewExperimental = lazy(() => import('./ProcessModelNewExperimental'));

// Loading component for Suspense
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

type OwnProps = {
  setAdditionalNavElement: Function;
  extensionUxElements?: UiSchemaUxElement[] | null;
  isMobile?: boolean;
};

export default function BaseRoutes({
  extensionUxElements,
  setAdditionalNavElement,
  isMobile = false,
}: OwnProps) {
  const [viewMode, setViewMode] = useState<'table' | 'tile'>(
    isMobile ? 'tile' : 'table',
  );
  const elementCallback = (uxElement: UiSchemaUxElement) => {
    return (
      <Route
        path={uxElement.page}
        key={uxElement.page}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Extension pageIdentifier={uxElement.page} />
          </Suspense>
        }
      />
    );
  };
  const extensionRoutes = extensionUxElementMap({
    displayLocation: 'routes',
    elementCallback,
    extensionUxElements,
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        overflow: 'auto',
        height: 'unset',
      }}
    >
      <ErrorDisplay />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {extensionRoutes}
          <Route path="/about" element={<About />} />
          <Route
            path="/"
            element={
              <Homepage
                viewMode={viewMode}
                setViewMode={setViewMode}
                isMobile={isMobile}
              />
            }
          />
          <Route
            path="/process-groups"
            element={
              <Processes setNavElementCallback={setAdditionalNavElement} />
            }
          />
          <Route
            path="/process-groups/:process_group_id"
            element={
              <Processes setNavElementCallback={setAdditionalNavElement} />
            }
          />
          <Route
            path="/process-models/:process_model_id"
            element={<ProcessModelShow />}
          />
          <Route
            path="/:modifiedProcessModelId/start"
            element={<StartProcessInstance />}
          />
          <Route
            path="/tasks/:process_instance_id/:task_guid"
            element={<TaskShow />}
          />
          <Route
            path="/started-by-me"
            element={
              <InstancesStartedByMe
                viewMode={viewMode}
                setViewMode={setViewMode}
                isMobile={isMobile}
              />
            }
          />
          <Route
            path="process-instances/for-me/:process_model_id/:process_instance_id/interstitial"
            element={<ProcessInterstitialPage variant="for-me" />}
          />
          <Route
            path="process-instances/for-me/:process_model_id/:process_instance_id/progress"
            element={<ProcessInstanceProgressPage variant="for-me" />}
          />
          <Route path="/messages" element={<MessageListPage />} />
          <Route path="/data-stores/*" element={<DataStoreRoutes />} />
          <Route
            path="/configuration/*"
            element={<Configuration extensionUxElements={extensionUxElements} />}
          />
          <Route path="/authentication-list" element={<AuthenticationList />} />
          <Route path="/secrets" element={<SecretList />} />{' '}
          <Route path="/secrets/new" element={<SecretNew />} />
          <Route path="/secrets/:secret_identifier" element={<SecretShow />} />
          <Route
            path=":process_group_id/new-e"
            element={<ProcessModelNewExperimental />}
          />
          <Route
            path="/process-models/:process_group_id/new"
            element={<ProcessModelNew />}
          />
          <Route
            path="/process-models/:process_model_id/edit"
            element={<ProcessModelEdit />}
          />
          <Route
            path="/process-models/:process_model_id/files/:file_name"
            element={<ProcessModelEditDiagram />}
          />
          <Route
            path="/process-models/:process_model_id/files"
            element={<ProcessModelEditDiagram />}
          />
          <Route
            path="/process-models/:process_model_id/form/:file_name"
            element={<ReactFormEditor />}
          />
          <Route
            path="/process-models/:process_model_id/form"
            element={<ReactFormEditor />}
          />
          <Route path="process-instances/*" element={<ProcessInstanceRoutes />} />
          <Route
            path="i/:process_instance_id"
            element={<ProcessInstanceShortLink />}
          />
          <Route path="/process-groups/new" element={<ProcessGroupNew />} />
          <Route
            path="/process-groups/:process_group_id/edit"
            element={<ProcessGroupEdit />}
          />
        </Routes>
      </Suspense>
    </Box>
  );
}
