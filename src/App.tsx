import TaskBuddy from './Components/TaskBuddy';
import './App.css';
import Login from './Components/Login';
import { useState, useEffect } from 'react';
import { auth } from '../src/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div>
          {user ? <TaskBuddy /> : <Login />}
        </div>
      </div>
    </>
  );
}

export default App;