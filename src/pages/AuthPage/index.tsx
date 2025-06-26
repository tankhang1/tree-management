import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Group,
  Box,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { IconLock, IconMail } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    console.log("Login with", email, password);
    navigate(PATH.HOME);
  };

  return (
    <Box h="100vh" w="100vw">
      <Stack align="center" justify="center" h="100%">
        <Paper withBorder shadow="lg" radius={4} p="xl" w={360}>
          <Title order={3} mb="sm" ta="center" c={"green"}>
            Đăng nhập hệ thống
          </Title>
          <Text size="sm" ta="center" mb="md">
            Vui lòng nhập thông tin tài khoản để tiếp tục
          </Text>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            radius={4}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            leftSection={<IconMail size={18} />}
          />
          <PasswordInput
            label="Mật khẩu"
            placeholder="••••••••"
            radius={4}
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            leftSection={<IconLock size={18} />}
          />
          <Group justify="space-between" mt="lg">
            <Text size="xs" c="dimmed">
              Quên mật khẩu?
            </Text>
          </Group>
          <Button fullWidth onClick={onLogin} radius={4} mt="md">
            Đăng nhập
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
};
export default AuthPage;
