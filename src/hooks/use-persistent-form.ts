import { useCallback, useEffect, useState } from "react";

/**
 * Hook for maintaining form state that persists between sessions
 * @param formKey Unique key to identify this form in localStorage
 * @param initialData Initial form data to use if nothing is saved
 * @returns Form state management functions
 */
export function usePersistentForm<T>(formKey: string, initialData: T) {
  // Load data from localStorage on init
  const loadSavedData = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialData;
    }

    try {
      const saved = localStorage.getItem(formKey);
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error("Error loading saved form data:", error);
      return initialData;
    }
  }, [formKey, initialData]);

  const [formData, setFormData] = useState<T>(loadSavedData());
  const [isDirty, setIsDirty] = useState(false);

  // Update form data and mark as dirty
  const updateFormData = useCallback((newData: T | ((prev: T) => T)) => {
    setFormData(newData);
    setIsDirty(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isDirty || typeof window === "undefined") return;

    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(formKey, JSON.stringify(formData));
        setIsDirty(false);
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }, 500);

    return () => clearTimeout(saveTimeout);
  }, [formData, formKey, isDirty]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(formKey);
      setFormData(initialData);
      setIsDirty(false);
    } catch (error) {
      console.error("Error clearing saved form data:", error);
    }
  }, [formKey, initialData]);

  // Force save current form data
  const forceSave = useCallback(() => {
    try {
      localStorage.setItem(formKey, JSON.stringify(formData));
      setIsDirty(false);
    } catch (error) {
      console.error("Error force saving form data:", error);
    }
  }, [formKey, formData]);

  return {
    formData,
    setFormData: updateFormData,
    clearSavedData,
    forceSave,
    isDirty,
  };
}
