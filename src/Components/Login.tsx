import { signInWithGoogle } from '../firebase/firebaseConfig'; // Adjust the import path
import GoogleIcon from "./../assets/google.png";
import Icon from "./../assets/Icon.png";
import TaskList from "./../assets/Task list view 3.png";

function Login() {
    const handleSignIn = async () => {
        await signInWithGoogle();
    };

    console.log('Login component rendered');
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
            <div style={{ marginLeft: "20px", display: "flex", gap: "30px", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "3px" }}>
                    <img src={Icon} alt="TaskbuddyIcon" width="30px" />
                    <h1 style={{ color: "purple", fontSize: "40px" }}>TaskBuddy</h1>
                </div>
                <p>Streamline your workflow and track progress effortlessly<br /> with our all-in-one task management app.</p>
                <button style={{ display: "flex", gap: "5px", backgroundColor: "black", color: "white", border: "1px solid black", borderRadius: "15px", padding: "10px 15px" }} onClick={handleSignIn}>
                    <img src={GoogleIcon} alt="googleIcon" style={{ height: "20px", width: "20px" }} />
                    Continue with Google
                </button>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        width: "834.3681640625px",
                        height: "834.3681640625px",
                        top: "41.46px",
                        left: "512.84px",
                        opacity: 0.5,
                        border: "0.73px solid purple",
                        borderRadius: "50%",
                        pointerEvents: 'none',
                        zIndex: 1,
                        color:"purple"

                    }}
                ></div>
                <div
                    style={{
                        position: "absolute",
                        width: "705.6121826171875px",
                        height: "705.6121826171875px",
                        top: "95.29px",
                        left: "563.04px",
                        opacity: "0.5",
                        border: "0.73px solid purple",
                        borderRadius: "50%",
                        pointerEvents: "none",

                    }}
                ></div>
                <div
                    style={{
                        position: "absolute",
                        width: "560.8525390625px",
                        height: "560.8525390625px",
                        top: "165.86px",
                        left: "635.78px",
                        border: "0.73px solid purple",
                        borderRadius: "50%", 
                        pointerEvents: "none",
                    }}
                ></div>
                <img
                    src={TaskList}
                    alt="tasklist"
                    style={{
                        maxWidth: "110%",
                        marginLeft:"650px",
                        zIndex: 2, 
                        height:"800px"
                    }}
                />
            </div>
        </div>
    );
}

export default Login;