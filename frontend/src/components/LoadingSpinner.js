import { useTranslation } from 'react-i18next';

function LoadingSpinner() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
    </div>
  );
}

export default LoadingSpinner;