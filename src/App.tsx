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
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./assets/logo.avif";
import { IconBell } from "@tabler/icons-react";
import { NAV_BAR } from "./constants/navbar.constants";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "./constants/path.constants";

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const onNavQueenFarm = () => {
    navigate(PATH.QUEEN_FARM);
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
          overflow: "visible",
          position: "relative",
          flexDirection: "column",
          boxSizing: "border-box",
          zIndex: 0,
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
                  style={{
                    borderColor: "gray", // border color
                  }}
                >
                  <IconBell size={18} />
                </ActionIcon>
              </Indicator>

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
                  },
                  section: {
                    color: isParentActive ? "#4CAF50" : undefined,
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
                        },
                        section: {
                          color: isChildActive ? "#4CAF50" : undefined,
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
    </AppShell>
  );
}
