import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import ApiService from '../services/ApiService';
import { ProcessInstance, ProcessModel, ProcessGroup } from '../interfaces';

// Common query keys for better cache management
export const queryKeys = {
  processInstances: 'processInstances',
  processInstance: (id: number) => ['processInstance', id],
  processModels: 'processModels',
  processModel: (id: string) => ['processModel', id],
  processGroups: 'processGroups',
  processGroup: (id: string) => ['processGroup', id],
  tasks: 'tasks',
  task: (id: string) => ['task', id],
};

/**
 * Hook for fetching process instances with filters
 */
export function useProcessInstances(filters?: any, options = {}) {
  return useQuery({
    queryKey: [queryKeys.processInstances, filters],
    queryFn: () => 
      ApiService.post('/process-instances', { report_metadata: filters || {} }),
    ...options,
  });
}

/**
 * Hook for fetching a single process instance
 */
export function useProcessInstance(id: number, options = {}) {
  return useQuery({
    queryKey: queryKeys.processInstance(id),
    queryFn: () => ApiService.get(`/process-instances/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for fetching process models
 */
export function useProcessModels(options = {}) {
  return useQuery({
    queryKey: [queryKeys.processModels],
    queryFn: () => ApiService.get('/process-models'),
    ...options,
  });
}

/**
 * Hook for fetching a single process model
 */
export function useProcessModel(id: string | undefined, options = {}) {
  return useQuery({
    queryKey: queryKeys.processModel(id || ''),
    queryFn: () => ApiService.get(`/process-models/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for fetching process groups
 */
export function useProcessGroups(options = {}) {
  return useQuery({
    queryKey: [queryKeys.processGroups],
    queryFn: () => ApiService.get('/process-groups'),
    ...options,
  });
}

/**
 * Hook for fetching a single process group
 */
export function useProcessGroup(id: string | undefined, options = {}) {
  return useQuery({
    queryKey: queryKeys.processGroup(id || ''),
    queryFn: () => ApiService.get(`/process-groups/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for starting a process instance
 */
export function useStartProcessInstance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (processModelId: string) => 
      ApiService.post(`/process-models/${processModelId}/process-instances`),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [queryKeys.processInstances] });
    },
  });
}

/**
 * Hook for completing a task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ processInstanceId, taskId, formData }: { processInstanceId: number, taskId: string, formData: any }) => 
      ApiService.put(`/process-instances/${processInstanceId}/tasks/${taskId}`, formData),
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.processInstance(variables.processInstanceId) });
      queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });
    },
  });
}

/**
 * Generic hook for API calls with React Query and cancellation support
 */
export function useApi<T>(
  key: QueryKey,
  apiCall: () => Promise<T>,
  options = {}
) {
  return useQuery({
    queryKey: key,
    queryFn: apiCall,
    ...options,
  });
}