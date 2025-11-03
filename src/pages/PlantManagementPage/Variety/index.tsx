import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Menu,
  Modal,
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
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddVarietyForm from "./components/AddVarietyForm";
import { Link } from "react-router-dom";
import VarietyDetailModal from "./components/VarietyDetailModal";

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
    name: "Đậu nành DT84",
    description:
      "Giống đậu nành DT84 sinh trưởng 90–100 ngày, chịu hạn tốt, hạt vàng sáng, năng suất cao.",
    treeName: "Đậu nành",
    imgUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    doc: "https://vaas.vn/giong-dau-nanh-dt84",
  },
  {
    id: "VAR02",
    name: "Đậu nành ĐX11",
    description:
      "Giống đậu nành ĐX11 cho năng suất ổn định, thời gian sinh trưởng 95 ngày, hạt to và chất lượng cao.",
    treeName: "Đậu nành",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
    doc: "https://nongnghiep.vn/giong-dau-nanh-dx11",
  },
  {
    id: "VAR03",
    name: "Bắp LVN10",
    description:
      "Giống bắp lai LVN10 sinh trưởng khỏe, kháng sâu bệnh tốt, năng suất cao, thời gian sinh trưởng 100–115 ngày.",
    treeName: "Bắp",
    imgUrl:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
    doc: "https://vaas.vn/giong-bap-lvn10",
  },
  {
    id: "VAR04",
    name: "Bắp NK66",
    description:
      "Giống bắp NK66 lai đơn, chịu hạn tốt, thích hợp vùng Đông Nam Bộ và Tây Nguyên.",
    treeName: "Bắp",
    imgUrl: "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
    doc: "https://nongnghiep.vn/giong-bap-nk66",
  },
  {
    id: "VAR05",
    name: "Bắp nếp HN68",
    description:
      "Giống bắp nếp HN68 cho hạt dẻo thơm, hạt trắng sữa, thời gian sinh trưởng khoảng 95 ngày.",
    treeName: "Bắp",
    imgUrl:
      "https://storage.vinaseed.com.vn/Data/2020/03/10/2-ngo-hn68-637194768462517218.jpg?w=620&h=350",
    doc: "https://vaas.vn/giong-bap-nep-hn68",
  },
];

const PlantManagementVarietyPage = () => {
  const [
    openedVarietyForm,
    { open: openVarietyForm, close: closeVarietyForm },
  ] = useDisclosure(false);
  const [
    openedVarietyDetailForm,
    { open: openVarietyDetailForm, close: closeVarietyDetailForm },
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
      header: "Tuỳ chọn",
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
            <Menu.Item
              onClick={openVarietyDetailForm}
              leftSection={<IconEye size={18} color="gray" />}
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
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm giống cây</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại cây, cây trồng
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {}}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: Sầu riêng Ri6, Xoài Cát Chu"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Loại cây trồng"
              description="Ví dụ: Hạt lai F1, Ghép cành"
              placeholder="Chọn thông tin"
              data={[
                "Hạt lai F1",
                "Ghép cành",
                "Chồi cây",
                "Hạt giống Robusta",
                "Hạt giống Thái",
              ]}
            />
            <MultiSelect
              label="Cây trồng"
              description="Ví dụ: Sầu riêng Ri6, Xoài Cát Chu"
              placeholder="Chọn thông tin"
              data={["Sầu riêng", "Xoài", "Bưởi", "Chôm chôm", "Măng cụt"]}
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={cropVarietyColumns} data={cropVarieties} />
      <Modal
        opened={openedVarietyForm}
        onClose={closeVarietyForm}
        size={"lg"}
        title={<Text fw={500}>Tạo mới giống cây</Text>}
      >
        <AddVarietyForm />
      </Modal>
      <VarietyDetailModal
        opened={openedVarietyDetailForm}
        onClose={closeVarietyDetailForm}
      />
    </Stack>
  );
};

export default PlantManagementVarietyPage;
