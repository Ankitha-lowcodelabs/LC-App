import Image from 'next/image';

interface AppData {
  name: string;
}

interface AppCardProps {
  app: AppData;
  onClick: () => void;
  logo: string;
} 

const AppCard: React.FC<AppCardProps> = ({ app, onClick, logo }) => {
  return (
    <div onClick={onClick}>
      <Image src={logo} alt={app.name} width={500} height={300} />
      <h3>{app.name}</h3>
    </div>
  );
}; 

export default AppCard; 