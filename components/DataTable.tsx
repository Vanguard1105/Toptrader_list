// components/DataTable.tsx
import { useEffect, useState } from 'react';

interface DataItem {
  Address: string;
  Total_PNL: number;
  overLap: boolean;
  Total_Profit: number;
  Win_Rate: number;
  Avg_Buy_Price: number;
  Token_Traded: number;
}

const DataTable = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [sortField, setSortField] = useState<keyof DataItem>('Address');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const fetchData = async (field: keyof DataItem, order: 'asc' | 'desc') => {
    const response = await fetch(`/api/data?field=${field}&order=${order}`);
    const result: DataItem[] = await response.json();
    setData(result);
    console.log(result)
  };
  useEffect(() => {
    fetchData(sortField, sortOrder);
  }, []);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof DataItem) => {
    // If the same field is clicked, toggle the sort order
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different field is clicked, set it as the new sort field and default to ascending order
      setSortField(field);
      setSortOrder('asc');
    }

    fetchData(sortField, sortOrder);

    // Fetch data again after sorting
  };

  return (
    <div className='bg-[rgb(36,34,34)]'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='text-slate-400 text-left bg-[rgb(51,51,51)] p-1'>
            <th className='px-3 w-[2%]'>#</th>
            <th className='w-[40%]' style={{ cursor: 'pointer' }}>Address</th>
            {['Total_PNL', 'Total_Profit', 'Win_Rate', 'Avg_Buy_Price', 'Token_Traded'].map(field => (
              <th key={field} onClick={() => handleSort(field as keyof DataItem)} style={{ cursor: 'pointer' }} className='w-[11%]'>
                {field} {sortField === field ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-black'>
          {paginatedData.map((item, index) => (
            <tr key={index} className='even:bg-[rgb(51,51,51)] hover:bg-gray-700 text-slate-300'>
              <td className='py-4 px-3 font-semibold text-slate-300 text-sm'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className='py-4 font-semibold text-slate-300 text-sm'><span className='min-w-9 sm:hidden md:hidden lg:inline '>😎 Profit Top 200 Dynamic: </span>{item.Address}</td>
              <td> <div className='w-fit bg-green-800 rounded-sm font-semibold text-slate-300 px-1'>{(item.Total_PNL / 100).toFixed(3)}x</div></td>
              <td className='py-4'><div className='w-fit bg-green-800 rounded-sm px-1 text-slate-300'>${item.Total_Profit.toFixed(2)}</div></td>
              <td className='text-balance'>{(item.Win_Rate * 100 / item.Token_Traded).toFixed(2)}%</td>
              <td>${item.Avg_Buy_Price.toFixed(2)}</td>
              <td>{item.Token_Traded}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>before</button>
        <span> Page {currentPage} </span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage)))}>Next</button>
      </div>
    </div>
  );
};

export default DataTable;