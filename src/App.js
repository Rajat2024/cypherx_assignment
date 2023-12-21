import React, { useState, useEffect } from 'react';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');
  const [finalTickets, setFinalTickets] = useState([]);
  // Fetch tickets data from the API
  useEffect(() => {
    fetch('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers')
      .then(response => response.json())
      .then(data => setTickets(data.tickets));
  }, []);

  // Function to dynamically group tickets based on the selected option
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
  
      groupedTickets = Object.entries(statusGroups); // Convert object into array of arrays
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
  
    }
    setFinalTickets(groupedTickets);
  };
  

  // Function to dynamically sort tickets based on the selected option
  const sortTickets = () => {
    let sortedTickets = [...finalTickets];
  
    if (sortOption === 'priority') {
      // Sort by priority
      for(let i = 0; i < sortedTickets.length; i++){
        // console.log(sortedTickets[i][1]);
        sortedTickets[i][1].sort((a, b) => b.priority > a.priority);
      }
      // sortedTickets.sort((a, b) => b.priority - a.priority);

    } else if (sortOption === 'title') {
      // Sort by title
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    setGroupingOption(sortedTickets);
    // Update the state or perform any other necessary actions with sortedTickets
    // console.log(sortedTickets);
    // setSortedTickets(sortedTickets);
  };
  

  useEffect(() => {
    groupTickets();
  }, [groupingOption]);

  useEffect(() => {
    sortTickets();
  }, [sortOption]);

  useEffect(()=>{
    console.log(finalTickets);
    },[finalTickets])
  // Render your Kanban board based on the grouped and sorted tickets

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
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            <p>{ticket.title}</p>
            {/* Include other ticket information based on your UI design */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
