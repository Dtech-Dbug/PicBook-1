import {useEffect,useState} from 'react';
//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {  Route, Switch } from "react-router-dom";
import UserFeed from "./Components/User/UserFeed";
import {auth,projectFirestore} from "./firebase/config";	
import Welcome from "./Components/welcome";
import { useDispatch } from 'react-redux';
import Header from './Components/Header/Header';
        
function App() {
	const [userState, setUserState] = useState(null); 
	const dispatch = useDispatch();
	const collectionRef = projectFirestore.collection("users");
	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
		 if(user){
			 
			await collectionRef.add({
				 'Name': user.displayName,
				 'Email':user.email, 
				 "UserProfile":user.photoURL
			});

			 console.log("Firebase User-->",user);
			 dispatch({	
				 		type: "USER_LOGGED_IN",
						payload: {
							Name: user.displayName,
							Email: user.email,
							UserProfile: user.photoURL
						}
					});
			setUserState(user);
		 }else{
			setUserState(null);
		 }
		});
	} , [dispatch,collectionRef]);

	const handleLogout = () => {
		auth.signOut();
		if(userState){
			dispatch({ type:"USER_LOGGED_OUT",payload:null});
		}
	}
	console.log("CHECK-->", process.env.REACT_APP_FIREBASE_API_KEY);
	return (
		<div className="App">
			<Header/>
			<ToastContainer />
			<Switch>
				<Route path="/" exact component={Welcome} />
				<Route path="/user" exact component={UserFeed} />
			</Switch>
			{userState && <button onClick={handleLogout}>Logout</button>}
		</div>
	);
}

export default App;
