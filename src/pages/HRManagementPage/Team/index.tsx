import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type Group = {
  id: string;
  name: string;
  description?: string;
  departments: string[]; // Danh sách ID phòng ban
  roles: string[]; // Danh sách vai trò
  members: {
    id: string;
    name: string;
    position: string;
  }[]; // Danh sách người trong nhóm
};
const groupData: Group[] = [
  {
    id: "GR001",
    name: "Nhóm Canh tác",
    description: "Phụ trách chăm sóc và giám sát cây trồng",
    departments: ["Phòng Canh tác", "Phòng Giám sát"],
    roles: ["Giám sát", "Kỹ thuật"],
    members: [
      { id: "U001", name: "Nguyễn Văn A", position: "Trưởng nhóm" },
      { id: "U002", name: "Trần Thị B", position: "Nhân viên" },
    ],
  },
  {
    id: "GR002",
    name: "Nhóm Vật tư",
    description: "Theo dõi kho và phân phối vật tư",
    departments: ["Phòng Vật tư"],
    roles: ["Kho", "Cung ứng"],
    members: [{ id: "U003", name: "Lê Văn C", position: "Nhân viên kho" }],
  },
];

const HRManagementTeamPage = () => {
  const navigate = useNavigate();
  const onAddTeam = () => {
    navigate(PATH.HR_ADD_TEAM);
  };
  const onTeamDetail = () => {
    navigate(PATH.HR_TEAM_DETAIL);
  };
  const groupColumns: MRT_ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Tên nhóm",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      Cell: ({ cell }) => <Text>{cell.getValue<string>() || "Không có"}</Text>,
    },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      Cell: ({ cell }) => (
        <Group gap="xs" wrap="wrap">
          {cell.getValue<string[]>()?.map((dep, idx) => (
            <Badge key={idx} color="blue" variant="light">
              {dep}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessorKey: "roles",
      header: "Vai trò",
      Cell: ({ cell }) => (
        <Group gap="xs" wrap="wrap">
          {cell.getValue<string[]>()?.map((role, idx) => (
            <Badge key={idx} color="teal" variant="light">
              {role}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessorKey: "members",
      header: "Thành viên",
      Cell: ({ cell }) => (
        <Stack gap={4}>
          {cell
            .getValue<{ id: string; name: string; position: string }[]>()
            ?.map((member, idx) => (
              <Group key={idx} gap={6}>
                <Text size="sm" fw={500}>
                  {member.name}
                </Text>
                <Badge size="xs" color="gray">
                  {member.position}
                </Badge>
              </Group>
            ))}
        </Stack>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onTeamDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý đội nhóm
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddTeam}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Select
          radius={4}
          leftSection={<IconHome size={18} />}
          placeholder="Chọn bộ phận"
          data={["Mùa vụ A"]}
        />
      </Group>
      <Table columns={groupColumns} data={groupData} />
    </Stack>
  );
};
export default HRManagementTeamPage;
