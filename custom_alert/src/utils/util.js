import { useToasts } from 'react-toast-notifications';

let unifiedConfigs = null;

export function useToast() {
  const { addToast } = useToasts();

  const generateToast = (message, type = 'info') => {
    addToast(message, {
      appearance: type, // success | error | warning | info
    });
  };

  return { generateToast };
}

export function generateEndPointUrl(name) {
    return `${unifiedConfigs.meta.restRoot}_${name}`;
}
