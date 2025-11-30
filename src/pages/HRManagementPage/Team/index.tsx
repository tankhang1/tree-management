import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useMemo, useState } from "react";
// Đảm bảo đường dẫn import đúng
import { useTeamStore } from "../../zustand/teamStore";
import { useDepartmentStore } from "../../zustand/departmentStore";
import { useEmployeeStore } from "../../zustand/employeeStore";

// Type hiển thị trên bảng (đã map từ ID sang Name)
type GroupDisplay = {
  id: string;
  name: string;
  description?: string;
  departments: string[]; // Tên phòng ban
  roles: string[]; // (Nếu có)
  members: {
    id: string;
    name: string;
    position: string;
  }[];
};

const HRManagementTeamPage = () => {
  const navigate = useNavigate();

  // 1. Hook Stores
  const { teams } = useTeamStore();
  const { departments } = useDepartmentStore();
  const { employees } = useEmployeeStore();

  // 2. Filter States
  const [filterName, setFilterName] = useState("");
  const [filterDepts, setFilterDepts] = useState<string[]>([]);

  // 3. Data Processing (Map ID -> Name)
  // FIX: Sửa Generic Type từ Team[] thành GroupDisplay[]
  const processedData = useMemo<GroupDisplay[]>(() => {
    return teams.map((team) => {
      // Map Department IDs -> Names
      const deptNames = team.departments?.map(
        (id) => departments.find((d) => d.id === id)?.name || id
      );

      // Map Member Objects -> Objects {id, name, position}
      const memberList = team.members.map((member, index) => {
        // Tìm nhân viên trong store dựa vào tên (hoặc ID nếu logic store của bạn lưu ID)
        const emp = employees.find((e) => e.fullName === member.name);

        return {
          // FIX: Xử lý ID. Nếu tìm thấy nhân viên thì lấy ID thật, nếu không thì tạo ID tạm
          id: emp ? emp.id : `temp-${team.id}-${index}`,
          name: member.name, // Lấy tên từ dữ liệu Team lưu trữ
          position: member.role || emp?.role || "Thành viên",
        };
      });

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        departments: deptNames,
        roles: team.roles || [],
        members: memberList,
      };
    });
  }, [teams, departments, employees]);

  // 4. Filtering Logic
  const filteredData = useMemo(() => {
    return processedData.filter((item) => {
      const matchName =
        filterName === "" ||
        item.name.toLowerCase().includes(filterName.toLowerCase());

      const matchDept =
        filterDepts.length === 0 ||
        item.departments.some((d) => filterDepts.includes(d));

      return matchName && matchDept;
    });
  }, [processedData, filterName, filterDepts]);

  // Handlers
  const onAddTeam = () => navigate(PATH.HR_ADD_TEAM);
  const onTeamDetail = (id: string) => navigate(`${PATH.HR_TEAM_DETAIL}/${id}`);

  const handleResetFilter = () => {
    setFilterName("");
    setFilterDepts([]);
  };

  // Options for MultiSelect
  const deptOptions = useMemo(
    () => departments.map((d) => d.name),
    [departments]
  );

  const groupColumns: MRT_ColumnDef<GroupDisplay>[] = [
    {
      accessorKey: "name",
      header: "Tên nhóm",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      Cell: ({ cell }) => (
        <Text lineClamp={2} title={cell.getValue<string>()}>
          {cell.getValue<string>() || "—"}
        </Text>
      ),
    },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      Cell: ({ cell }) => (
        <Group gap={4} wrap="wrap">
          {cell.getValue<string[]>()?.map((dep, idx) => (
            <Badge key={idx} color="blue" variant="light">
              {dep}
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
            ?.slice(0, 3) // Chỉ hiện 3 người đầu
            .map((member, idx) => (
              <Group key={idx} gap={6}>
                <Text size="sm" fw={500}>
                  {member.name}
                </Text>
                <Badge size="xs" color="gray" variant="outline">
                  {member.position}
                </Badge>
              </Group>
            ))}
          {cell.getValue<any[]>().length > 3 && (
            <Text size="xs" c="dimmed">
              + {cell.getValue<any[]>().length - 3} thành viên khác
            </Text>
          )}
        </Stack>
      ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => onTeamDetail(row.original.id)}
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm đội nhóm</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc phòng ban
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResetFilter}
              >
                Làm mới
              </Button>
            </Tooltip>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Tìm kiếm theo tên"
            placeholder="Ví dụ: Nhóm canh tác..."
            leftSection={<IconSearch size={16} />}
            value={filterName}
            onChange={(e) => setFilterName(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconHome size={18} />}
              label="Phòng ban"
              placeholder="Chọn phòng ban"
              data={deptOptions}
              value={filterDepts}
              onChange={setFilterDepts}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Table columns={groupColumns} data={filteredData} />
    </Stack>
  );
};

export default HRManagementTeamPage;
