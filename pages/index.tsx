// pages/index.tsx
import DataTable from '../components/DataTable';

const HomePage: React.FC = () => {
  return (
    <div className='bg-[rgb(36,34,34)] w-screen h-screen'>
      <h1 className='py-3'>Data Table</h1>
      <DataTable />
    </div>
  );
};

export default HomePage;