import React, { useState, useEffect } from 'react';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');
  const [finalTickets, setFinalTickets] = useState([]);

  // Fetch tickets data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers');
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the async function

  }, []); 
  
  const groupTickets = () => {

    let groupedTickets = [];

    if (groupingOption === 'status') {
      // Group by status
      const statusGroups = {};

      tickets.forEach((ticket) => {
        const status = ticket.status;
        if (!statusGroups[status]) {
          statusGroups[status] = [];
        }
        statusGroups[status].push(ticket);
      });

      groupedTickets = Object.entries(statusGroups);
    } else if (groupingOption === 'user') {
      // Group by user
      const userGroups = {};

      tickets.forEach((ticket) => {
        const user = ticket.userId;
        if (!userGroups[user]) {
          userGroups[user] = [];
        }
        userGroups[user].push(ticket);
      });

      groupedTickets = Object.entries(userGroups);
    } else if (groupingOption === 'priority') {
      // Group by priority
      const priorityGroups = {};

      tickets.forEach((ticket) => {
        const priority = ticket.priority;
        if (!priorityGroups[priority]) {
          priorityGroups[priority] = [];
        }
        priorityGroups[priority].push(ticket);
      });

      groupedTickets = Object.entries(priorityGroups);
    }

    setFinalTickets(groupedTickets);
  };

  // Function to dynamically sort tickets based on the selected option
  const sortTickets = () => {
    let sortedTickets = [...finalTickets];

    if (sortOption === 'priority') {
      // Sort by priority
      sortedTickets.forEach((group) => {
        group[1].sort((a, b) => b.priority - a.priority);
      });
    } else if (sortOption === 'title') {
      // Sort by title
      sortedTickets.sort((a, b) => a[1][0].title.localeCompare(b[1][0].title));
    }

    setFinalTickets(sortedTickets);
  };

  useEffect(() => {
    groupTickets(groupingOption);
    sortTickets(sortOption);
  }, [tickets]);

  useEffect(() => {
    console.log(finalTickets);
  }, [finalTickets]);

useEffect(() => {
  groupTickets();
}, [groupingOption]);
  
useEffect(() => {
  sortTickets();
}, [sortOption]);

  return (
    <div>
      <div>
        {/* Controls for selecting grouping and sorting options */}
        <label>
          Group by:
          <select
            value={groupingOption}
            onChange={(e) => setGroupingOption(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <label>
          Sort by:
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <div>
        {/* Display your Kanban board UI */}
        {/* Example: */}
        {finalTickets.map(([group, groupTickets]) => (
          <div key={group}>
            <p>{group}</p>
            {groupTickets.map((ticket) => (
              <div key={ticket.id}>
                <p>{ticket.title}</p>
                {/* Include other ticket information based on your UI design */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
