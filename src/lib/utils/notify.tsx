import { notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'open';

interface ShowNotificationProps {
  message: string;
  description?: string;
  type?: NotificationType;
}

export const showNotification = ({ message, description, type = 'open' }: ShowNotificationProps): void => {
  notification[type]({
    message: <p className="textos-16 !font-extrabold">{message}</p>,
    description: <p className="inter-12 blanco">{description}</p>,
    icon: <InfoCircleOutlined style={{ color: '#fff' }} />,
    style: {
      backgroundColor: '#000',
      color: '#fff',
      border: '1px solid #4D4D4D',
      borderRadius: '5px',
    },
    duration: 5,
  });
};
