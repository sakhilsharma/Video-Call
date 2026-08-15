import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState  ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/users`
})


export const AuthProvider = ({ children }) => { //childern: like what are we providing inside the rapper

    const authContext = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(authContext);
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        const getUser = async () => {
            try {
                const response = await client.get("/getUser", {
                    params: {
                        token: token
                    }
                });

                setUserData(response.data.user);

            } catch (err) {
                console.log("Could not restore user", err);
                localStorage.removeItem("token");
                setUserData(null);
            }
        };

        getUser();
    }, []);

    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            setIsLoading(true);
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleLogin = async (username, password) => {
        try {
            setIsLoading(true);
            let request = await client.post("/login", {
                username: username,
                password: password
            });
            //Prmoise selved after 3 second--> test Loader
            // await new Promise(resolve => setTimeout(resolve, 3000));

            console.log(request.data)

            if (request.status === httpStatus.OK) {

                localStorage.setItem("token", request.data.token);
                console.log()
                setUserData(request.data.user);//user.name and user.username
                router("/home")
            }
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    //functions to handle history of user
    const getHistoryOfUser = async () => {

        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });

            try {
                console.log(request);
            }
            catch (e) {
                throw e;
            }
            return request
        } catch (e) {
            throw e;
        }
    }




    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin, isLoading
    }


    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}