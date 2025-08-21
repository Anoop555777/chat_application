import { useNavigate, useParams } from "react-router-dom";

import { Box, Text, Spinner, Button } from "@chakra-ui/react";
import useVerify from "../features/authentication/useVerify";
import { useEffect } from "react";
import FullPage from "../ui/FullPage";
import SpinnerUI from "../ui/SpinnerUI";

const VerifyUser = () => {
  const { verify_token } = useParams();
  const navigate = useNavigate();
  const { verify, isPending: isLoading, isError, isSuccess } = useVerify();

  useEffect(() => {
    verify(verify_token);
  }, [verify, verify_token]);

  if (isLoading)
    return (
      <FullPage>
        <SpinnerUI />
      </FullPage>
    );

  return (
    <Box textAlign="center" mt="50px">
      {isSuccess && (
        <>
          <Text fontSize="2xl" color="green.500">
            ✅ Email verified successfully!
          </Text>
          <Text mt={2}>Redirecting you to login...</Text>
          {setTimeout(() => navigate("/login"), 2000)}
        </>
      )}

      {isError && (
        <>
          <Text fontSize="2xl" color="red.500">
            ❌ Verification failed or token expired.
          </Text>
          <Button mt={4} onClick={() => navigate("/resend-verification")}>
            Resend Verification
          </Button>
        </>
      )}
    </Box>
  );
};

export default VerifyUser;
