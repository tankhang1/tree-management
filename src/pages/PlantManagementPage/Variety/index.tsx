import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Image,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
  IconTree,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddVarietyForm from "./components/AddVarietyForm";
import { Link } from "react-router-dom";

type CropVariety = {
  id: string;
  name: string;
  description: string;
  treeName: string;
  imgUrl: string;
  doc: string;
};
const cropVarieties: CropVariety[] = [
  {
    id: "VAR01",
    name: "Sầu riêng Ri6",
    description:
      "Giống sầu riêng phổ biến, cơm vàng, hạt lép, thơm ngọt, xuất xứ từ miền Tây Việt Nam.",
    treeName: "Sầu riêng",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
    doc: "Link",
  },
  {
    id: "VAR02",
    name: "Sầu riêng Monthong",
    description:
      "Giống sầu riêng Thái Lan, múi to, cơm dày, mùi nhẹ, dễ trồng và bảo quản.",
    treeName: "Sầu riêng",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
    doc: "Link",
  },
  {
    id: "VAR03",
    name: "Xoài Cát Chu",
    description:
      "Giống xoài ngọt đậm, vỏ vàng óng, thịt mềm mịn, đặc sản Cao Lãnh – Đồng Tháp.",
    treeName: "Xoài",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
    doc: "Link",
  },
  {
    id: "VAR04",
    name: "Xoài Tượng",
    description:
      "Giống xoài to trái, chắc thịt, thích hợp cho trồng đại trà ở vùng nhiệt đới.",
    treeName: "Xoài",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
    doc: "Link",
  },
  {
    id: "VAR05",
    name: "Chuối già Nam Mỹ",
    description:
      "Giống chuối được trồng phổ biến để xuất khẩu, năng suất cao, chịu bệnh tốt.",
    treeName: "Chuối",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
    doc: "Link",
  },
];

const PlantManagementVarietyPage = () => {
  const [
    openedVarietyForm,
    { open: openVarietyForm, close: closeVarietyForm },
  ] = useDisclosure(false);
  const cropVarietyColumns: MRT_ColumnDef<CropVariety>[] = [
    {
      accessorKey: "imgUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return url ? (
          <Image
            src={url}
            alt="Ảnh giống cây"
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Text size="xs" c="dimmed">
            Không có ảnh
          </Text>
        );
      },
    },
    {
      accessorKey: "treeName",
      header: "Tên cây",
    },
    {
      accessorKey: "id",
      header: "Mã giống",
    },
    {
      accessorKey: "name",
      header: "Tên giống",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      size: 300,
      Cell: ({ cell }) => (
        <Tooltip label={cell.getValue<string>()}>
          <Text lineClamp={2}>{cell.getValue<string>()}</Text>
        </Tooltip>
      ),
    },
    {
      accessorKey: "doc",
      header: "Tài liệu",
      Cell: ({ cell }) => <Link to={"/"}>{cell.getValue<string>()}</Link>,
    },
    {
      id: "actions",
      header: "",
      enableColumnActions: false,
      enableSorting: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md" position="bottom-end" withArrow>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={18} />
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
          Quản lý giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openVarietyForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Autocomplete
          radius={4}
          leftSection={<IconTree size={18} />}
          placeholder="Cây trồng"
          data={[
            "Sầu riêng",
            "Xoài",
            "Chuối",
            "Cà phê",
            "Mít",
            "Bưởi",
            "Dừa",
            "Cam",
            "Chanh",
            "Ổi",
            "Táo",
            "Lê",
            "Mận",
            "Vải",
            "Nhãn",
          ]}
        />
      </Group>
      <Table columns={cropVarietyColumns} data={cropVarieties} />
      <Modal
        opened={openedVarietyForm}
        onClose={closeVarietyForm}
        size={"lg"}
        title={<Text fw={500}>Tạo mới giống cây</Text>}
      >
        <AddVarietyForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementVarietyPage;
