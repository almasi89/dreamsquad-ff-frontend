import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LeagueList() {
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/leagues`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setLeagues(data);
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };
    fetchLeagues();
  }, []);

  const createLeague = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/leagues/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: leagueName, isPrivate }),
      });
      if (response.ok) {
        setLeagueName('');
        setIsPrivate(false);
        const data = await response.json();
        setLeagues([...leagues, data]);
      }
    } catch (error) {
      console.error('Error creating league:', error);
    }
  };

  const joinLeague = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/leagues/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: joinCode }),
      });
      if (response.ok) {
        setJoinCode('');
        navigate('/league');
      }
    } catch (error) {
      console.error('Error joining league:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Leagues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Create League</h3>
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            placeholder="League Name"
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <span className="text-white text-sm">Private League</span>
          </label>
          <button
            onClick={createLeague}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition duration-200 font-semibold"
          >
            Create League
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Join League</h3>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="League Code"
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
          />
          <button
            onClick={joinLeague}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition duration-200 font-semibold"
          >
            Join League
          </button>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">Available Leagues</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {leagues.map((league) => (
          <div key={league.id} className="bg-gray-700 p-4 rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-white">{league.name}</h4>
            <p className="text-sm text-gray-300">{league.is_private ? 'Private' : 'Public'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeagueList;