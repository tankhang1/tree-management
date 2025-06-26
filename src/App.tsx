// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Image,
  Indicator,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./assets/logo.avif";
import { IconBell, IconLogout, IconMessageChatbot } from "@tabler/icons-react";
import { NAV_BAR } from "./constants/navbar.constants";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "./constants/path.constants";
import ChatbotModal from "./components/Chatbot";

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  const [openedChatbot, { open: openChatbot, close: closeChatbot }] =
    useDisclosure(false);

  const navigate = useNavigate();
  const location = useLocation();
  const onNavQueenFarm = () => {
    navigate(PATH.HOME);
  };
  const onLogout = () => {
    navigate(PATH.AUTH);
  };
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      styles={{
        main: {
          width: "100dvw",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Stack>
          <Group h="100%" px="md" justify="space-between" align="center">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Group align="center">
                <Image src={Logo} w={50} h={50} fit="contain" />
                <Text visibleFrom="md" fw={"bold"}>
                  QUEEN ECO SMART FARM
                </Text>
              </Group>
            </Group>
            <Group>
              <Indicator color="red" size={6}>
                <ActionIcon
                  variant="outline"
                  color={"gray"}
                  radius={4}
                  style={{
                    borderColor: "gray", // border color
                  }}
                >
                  <IconBell size={18} />
                </ActionIcon>
              </Indicator>
              <ActionIcon
                onClick={onLogout}
                variant="outline"
                color={"gray"}
                radius={4}
                style={{
                  borderColor: "gray", // border color
                }}
              >
                <IconLogout size={18} />
              </ActionIcon>
              <Avatar
                size="md"
                radius={100}
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                onClick={onNavQueenFarm}
              />
            </Group>
          </Group>
        </Stack>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea>
          {NAV_BAR.map((item) => {
            const isParentActive =
              location.pathname === item.link ||
              item.children?.some((child) => location.pathname === child.link);

            return (
              <NavLink
                key={item.label}
                label={item.label}
                leftSection={<item.icon size={18} />}
                defaultOpened={isParentActive}
                active={isParentActive}
                onClick={() => {
                  if (!item.children) {
                    navigate(item.link);
                  }
                }}
                variant="light"
                color="brand"
                style={{ marginBottom: 8 }}
                styles={{
                  label: {
                    color: isParentActive ? "#4CAF50" : undefined,
                    "&:hover": {
                      color: "#4CAF50",
                    },
                  },
                  section: {
                    color: isParentActive ? "#4CAF50" : undefined,
                    "&:hover": {
                      color: "#4CAF50",
                    },
                  },
                }}
              >
                {item.children?.map((child) => {
                  const isChildActive = location.pathname === child.link;
                  return (
                    <NavLink
                      key={child.label}
                      label={child.label}
                      active={isChildActive}
                      onClick={() => navigate(child.link)}
                      variant="subtle"
                      color="gray"
                      styles={{
                        label: {
                          fontSize: 14,
                          color: isChildActive ? "#4CAF50" : "#757575",
                          "&:hover": {
                            color: "#4CAF50",
                          },
                        },
                        section: {
                          color: isChildActive ? "#4CAF50" : undefined,
                          "&:hover": {
                            color: "#4CAF50",
                          },
                        },
                      }}
                    />
                  );
                })}
              </NavLink>
            );
          })}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main pos={"relative"}>
        <Outlet />
      </AppShell.Main>
      {!openedChatbot && (
        <ActionIcon
          w={58}
          h={58}
          radius={100}
          pos="fixed"
          bottom={24}
          right={24}
          onClick={openChatbot}
          style={{
            zIndex: 999,
            background:
              "linear-gradient(135deg, rgba(67, 233, 123, 0.4), rgba(56, 249, 215, 0.4))",
            boxShadow: "0 8px 24px rgba(67, 233, 123, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 12px 28px rgba(67, 233, 123, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(67, 233, 123, 0.25)";
          }}
        >
          <IconMessageChatbot size={32} color="white" />
        </ActionIcon>
      )}
      <Modal
        opened={openedChatbot}
        onClose={closeChatbot}
        title="🤖 Trợ lý ảo"
        size="md"
        centered
        radius="md"
        overlayProps={{ blur: 3 }}
      >
        <ChatbotModal closeChatbot={closeChatbot} />
      </Modal>
    </AppShell>
  );
}
