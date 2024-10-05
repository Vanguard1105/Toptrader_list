import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../db';

interface DataItem {
  Address: string;
  average_profit: number;
  overLap: boolean;
  totalRevenue: number;
  averageBuySize: number;
  tokensTraded: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DataItem[] | { message: string }>) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<DataItem>('wallet_data'); // Replace with your collection name

    // Get sorting parameters from query
    const { field = 'wallet_address', order = 'asc' } = req.query;

    // Sort the data based on query parameters
    const items = await collection.find({}).sort({ [field as string]: order === 'asc' ? 1 : -1 }).toArray();

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}