import { FC, Fragment, useRef, useEffect, useState } from "react";
import {
  Container,
  Grid2 as Grid,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import video from "../assets/test.mp4";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(/[a-z]/, "Must have at least one lowercase letter")
    .matches(/[A-Z]/, "Must have at least one uppercase letter")
    .matches(/[0-9]/, "Must have at least one number")
    .matches(/[@$!%*?&]/, "Must have at least one special character")
    .required("Password is required"),
});

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}
const Login: FC<Props> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await validationSchema.validate(formData, { abortEarly: false });

      if (
        formData.email === "user@mail.com" &&
        formData.password === "Test@1234"
      ) {
        const token = import.meta.env.VITE_LOGIN_TOKEN;
        Boolean(token) && localStorage.setItem("oidc", JSON.stringify(token));
        props.setToken(token)
        navigate("/dashboard");
      } else {
        toast.error("Incorrect username or password", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      setErrors({});
    } catch (err: any) {
      const validationErrors: Partial<Record<keyof FormData, string>> = {};
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error: any) => {
          const path = error.path as keyof FormData;
          validationErrors[path] = error.message;
        });
      } else {
        console.log("error here", err);
        toast(err);
      }

      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0px !important",
        }}
        disableGutters
      >
        <Grid container style={{ height: "inherit" }}>
          {
            !isMobile && (
              <Grid size={6}>
              <video
                width="600"
                muted
                style={{
                  height: "100%",
                  objectFit: "cover",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
                ref={videoRef}
              >
                <source src={video} type="video/mp4" />
              </video>
            </Grid>
            )
          }

          <Grid
            size={isMobile ? 12 : 6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                margin: (theme) => theme.spacing(3),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: (theme) => theme.spacing(3),
                width: "70%",
              }}
            >
              <h1>LOGIN TO UMP</h1>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={4}>
                  <Grid size={12}>
                    <TextField
                      variant="standard"
                      fullWidth
                      id="email"
                      label="Enter your email"
                      name="email"
                      autoFocus
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span style={{ color: "red" }}>{errors.email}</span>
                    )}
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      variant="standard"
                      fullWidth
                      id="password"
                      label="Enter your password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    {errors.password && (
                      <span style={{ color: "red" }}>{errors.password}</span>
                    )}
                  </Grid>
                </Grid>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    margin: (theme) => theme.spacing(5, 0, 2),
                    padding: "10px 0px 10px 0px",
                  }}
                  loading={loading}
                  loadingIndicator={
                    <CircularProgress color="inherit" size={16} />
                  }
                  loadingPosition="center"
                >
                  Login
                </LoadingButton>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Login;
