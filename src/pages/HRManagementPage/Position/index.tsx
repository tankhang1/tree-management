import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useForm } from "@mantine/form";
import { useState } from "react";
type Position = {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
const positions: Position[] = [
  {
    id: "D001",
    code: "FB-KT",
    name: "Marketing Senior",
    description: "Phụ trách quản bá",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
];

const HRManagementPositionPage = () => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      description: "",
    },
  });
  const positionColumns: MRT_ColumnDef<Position>[] = [
    {
      accessorKey: "code",
      header: "Mã phòng",
    },
    {
      accessorKey: "name",
      header: "Tên vị trí",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật gần nhất",
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
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
          Quản lý vị trí ( vai trò )
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={() => setOpened(!opened)}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={positionColumns} data={positions} />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw={"bold"}>Tạo vị trí mới</Text>}
        radius={4}
      >
        <form>
          <TextInput
            label="Mã vị trí"
            placeholder="PB-KT"
            withAsterisk
            {...form.getInputProps("code")}
            radius={4}
          />
          <TextInput
            label="Tên vị trí"
            placeholder="Tên vị trí"
            withAsterisk
            mt="md"
            {...form.getInputProps("name")}
            radius={4}
          />
          <Textarea
            label="Mô tả"
            placeholder="Mô tả chức năng, nhiệm vụ..."
            mt="md"
            {...form.getInputProps("description")}
            radius={4}
          />

          <Group justify="flex-end" mt="lg">
            <Button type="submit" radius={4}>
              Lưu
            </Button>
          </Group>
        </form>
      </Modal>
    </Stack>
  );
};
export default HRManagementPositionPage;
