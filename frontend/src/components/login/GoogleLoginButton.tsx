import { roboto } from "@/style/constants";
import { Button, HStack, Image, Text } from "@chakra-ui/react";
import { FC } from "react";

type GoogleLoginButtonProps = {
  onClick: () => void;
};

export const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ onClick }) => {
  return (
    <Button
      display="flex"
      justifyContent={"space-between"}
      alignItems={"center"}
      px={"8px"}
      backgroundColor="white"
      color={"#757575"}
      fontSize="14px"
      border="1px solid #dadce0"
      onClick={onClick}
      fontFamily={roboto.style.fontFamily}
      fontWeight={"500"}
    >
      <HStack justify={"center"} w={"100%"}>
        <Image src="/googleicon.svg" w={"18px"} h={"18px"} alt="Google Logo" />
        <Text>Continue with Google</Text>
      </HStack>
    </Button>
  );
};
