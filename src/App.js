import React, { useEffect, useState, useRef } from "react";
import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'


export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    value: [] 
  },
  reducers: {
    setUsers: (state, action) => {
      state.value = action.payload
    },
  }
})


const Auto = () => {
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const users = useSelector(state => state.users.value)

  const dispatch = useDispatch()

  useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json())
        .then((users) => dispatch(usersSlice.actions.setUsers(users)));
  }, []);


  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
    window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = event => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateUsername = username => {
    setSearch(username);
    setDisplay(false);
  };

  return (
    <div ref={wrapperRef} >
      <input
        id="auto"
        onClick={() => setDisplay(!display)}
        placeholder="Insert username"
        value={search}
        onChange={event => setSearch(event.target.value)}
      />
      {display && search && (
        <div>
          {users
            .filter(({username}) => username.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()))
            .map((value, i) => {
              return (
                <div
                  onClick={() => updateUsername(value.username)}
                  className="option"
                  key={i}
                  tabIndex="0"
                >
                <span>{value.username}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer  
}})

function App() {

  return (
    <div >
      <Provider store={store}>
        <h1>AutoComplete</h1>
        <Auto/>
      </Provider>
   </div>
      
  );
}


export default App;
