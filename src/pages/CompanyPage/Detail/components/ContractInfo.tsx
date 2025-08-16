import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendar,
  IconContract,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
  IconTypeface,
} from "@tabler/icons-react";
import Table from "../../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
type Contract = {
  id: string;
  name: string;
  contractType: "Thu" | "Mua";
  summary: string;
  items: string[]; // tên các vật tư / thuốc / máy móc / thành phẩm
  quantity: number;
  unit: string;
  value: number;
  currency: string;
  status: "Đang hiệu lực" | "Đã kết thúc" | "Chờ duyệt";
  startDate: string;
  endDate: string;
  partner: string; // Tên đối tác / khách hàng
  fileUrl?: string;
};
const contractData: Contract[] = [
  {
    id: "HD001",
    name: "Hợp đồng thu mua sầu riêng 2024",
    contractType: "Thu",
    summary: "Thu mua sản phẩm sầu riêng từ vùng trồng A",
    items: ["Sầu riêng Ri6", "Thùng vận chuyển"],
    quantity: 5000,
    unit: "Kg",
    value: 250_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    partner: "Công ty Nông sản ABC",
    fileUrl: "/contracts/hd001.pdf",
  },
  {
    id: "HD002",
    name: "Hợp đồng mua máy móc đợt 1",
    contractType: "Mua",
    summary: "Mua thiết bị phục vụ sản xuất",
    items: ["Máy cày Kubota", "Thuốc trừ sâu B58"],
    quantity: 20,
    unit: "Cái",
    value: 120_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    partner: "Công ty Thiết bị Nông nghiệp DEF",
    fileUrl: "",
  },

  {
    id: "HD003",
    name: "Hợp đồng tiêu thụ xoài 2025",
    contractType: "Thu",
    summary: "Cung ứng xoài Cát Chu cho hệ thống siêu thị nội địa",
    items: ["Xoài Cát Chu loại 1"],
    quantity: 12_000,
    unit: "Kg",
    value: 360_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    partner: "Siêu thị An Phú Mart",
    fileUrl: "/contracts/hd003.pdf",
  },
  {
    id: "HD004",
    name: "Hợp đồng mua phân bón NPK",
    contractType: "Mua",
    summary: "Mua NPK 16-16-8 phục vụ vụ Hè Thu",
    items: ["Phân bón NPK 16-16-8"],
    quantity: 50,
    unit: "Tấn",
    value: 750_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-02-01",
    endDate: "2025-03-31",
    partner: "Công ty Phân bón Việt Xanh",
    fileUrl: "/contracts/hd004.pdf",
  },
  {
    id: "HD005",
    name: "Hợp đồng thu mua mít sấy",
    contractType: "Thu",
    summary: "Thu mua mít sấy đóng gói xuất khẩu",
    items: ["Mít sấy", "Bao bì hút chân không"],
    quantity: 8_000,
    unit: "Kg",
    value: 1_200_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2025-03-05",
    endDate: "2025-09-30",
    partner: "Công ty Xuất khẩu Thái Bình Dương",
    fileUrl: "",
  },
  {
    id: "HD006",
    name: "Hợp đồng mua hệ thống tưới nhỏ giọt",
    contractType: "Mua",
    summary: "Đầu tư hệ thống tưới nhỏ giọt cho vườn cây ăn trái",
    items: ["Bơm tăng áp", "Dây tưới nhỏ giọt", "Bộ lọc cát"],
    quantity: 1,
    unit: "Bộ",
    value: 980_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-04-01",
    endDate: "2025-05-15",
    partner: "AgriTech Solutions Co.",
    fileUrl: "/contracts/hd006.pdf",
  },
  {
    id: "HD007",
    name: "Hợp đồng thu mua sầu riêng 2025 đợt 1",
    contractType: "Thu",
    summary: "Thu mua sầu riêng Ri6 và Monthong đầu vụ",
    items: ["Sầu riêng Ri6", "Sầu riêng Monthong"],
    quantity: 7_500,
    unit: "Kg",
    value: 525_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2025-05-20",
    endDate: "2025-08-30",
    partner: "Công ty Nông sản ABC",
    fileUrl: "/contracts/hd007.pdf",
  },
  {
    id: "HD008",
    name: "Hợp đồng mua thuốc BVTV hữu cơ",
    contractType: "Mua",
    summary: "Bổ sung thuốc BVTV hữu cơ cho vườn VietGAP",
    items: ["Chế phẩm vi sinh trừ nấm", "Dung dịch xua côn trùng"],
    quantity: 2_000,
    unit: "Lít",
    value: 300_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-06-01",
    endDate: "2025-07-15",
    partner: "EcoFarm BioCare",
    fileUrl: "",
  },
  {
    id: "HD009",
    name: "Hợp đồng tiêu thụ chanh dây",
    contractType: "Thu",
    summary: "Cung ứng chanh dây loại 1 cho nhà máy chế biến",
    items: ["Chanh dây tươi", "Thùng carton 10Kg"],
    quantity: 20_000,
    unit: "Kg",
    value: 400_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-06-10",
    endDate: "2025-12-31",
    partner: "Nhà máy Nước ép FreshDrink",
    fileUrl: "/contracts/hd009.pdf",
  },
  {
    id: "HD010",
    name: "Hợp đồng mua máy kéo mini",
    contractType: "Mua",
    summary: "Mua máy kéo mini cho khu sản xuất B",
    items: ["Máy kéo Yanmar 24HP", "Phụ tùng kèm theo"],
    quantity: 2,
    unit: "Cái",
    value: 860_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2025-07-05",
    endDate: "2025-08-20",
    partner: "Công ty TNHH Cơ khí Đồng Tâm",
    fileUrl: "/contracts/hd010.pdf",
  },
  {
    id: "HD011",
    name: "Hợp đồng thu tiêu thụ chuối xuất khẩu 2025",
    contractType: "Thu",
    summary: "Tiêu thụ chuối xuất khẩu theo tiêu chuẩn GlobalG.A.P",
    items: ["Chuối già Nam Mỹ", "Tem truy xuất QR"],
    quantity: 150_000,
    unit: "Kg",
    value: 5_800_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-07-20",
    endDate: "2026-01-20",
    partner: "Global Fruit Trading Ltd.",
    fileUrl: "/contracts/hd011.pdf",
  },
  {
    id: "HD012",
    name: "Hợp đồng mua bao bì đóng gói",
    contractType: "Mua",
    summary: "Cung ứng bao bì thân thiện môi trường",
    items: ["Túi PLA 5kg", "Màng co sinh học"],
    quantity: 60_000,
    unit: "Cái",
    value: 420_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-07-25",
    endDate: "2025-09-30",
    partner: "GreenPack Vietnam",
    fileUrl: "",
  },
  {
    id: "HD013",
    name: "Hợp đồng thu mua dứa (khóm) H2",
    contractType: "Thu",
    summary: "Thu mua dứa H2 phục vụ sản xuất mứt",
    items: ["Dứa H2", "Thùng xốp giữ lạnh"],
    quantity: 30_000,
    unit: "Kg",
    value: 600_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-03-01",
    endDate: "2024-09-01",
    partner: "Xưởng Thực phẩm An Nhiên",
    fileUrl: "/contracts/hd013.pdf",
  },
  {
    id: "HD014",
    name: "Hợp đồng mua máy sấy thăng hoa",
    contractType: "Mua",
    summary: "Đầu tư máy sấy thăng hoa 50kg/mẻ",
    items: ["Máy sấy thăng hoa 50kg", "Lắp đặt & đào tạo"],
    quantity: 1,
    unit: "Bộ",
    value: 3_200_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-01",
    endDate: "2025-11-30",
    partner: "FreezeDry Tech JSC",
    fileUrl: "/contracts/hd014.pdf",
  },
  {
    id: "HD015",
    name: "Hợp đồng thu mua bơ Hass",
    contractType: "Thu",
    summary: "Thu mua bơ Hass loại 1 cho thị trường TP.HCM",
    items: ["Bơ Hass", "Khay xốp 1kg"],
    quantity: 25_000,
    unit: "Kg",
    value: 1_000_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-05",
    endDate: "2026-02-05",
    partner: "Công ty Phân phối Minh Tâm",
    fileUrl: "/contracts/hd015.pdf",
  },
  {
    id: "HD016",
    name: "Hợp đồng mua dịch vụ vận tải lạnh",
    contractType: "Mua",
    summary: "Thuê vận tải lạnh cho tuyến miền Tây ↔ TP.HCM",
    items: ["Dịch vụ xe lạnh 5 tấn", "Bảo hiểm hàng hóa"],
    quantity: 24,
    unit: "Chuyến",
    value: 960_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-10",
    endDate: "2026-02-10",
    partner: "LogiCool Express",
    fileUrl: "",
  },
  {
    id: "HD017",
    name: "Hợp đồng thu tiêu thụ nhãn lồng Hưng Yên",
    contractType: "Thu",
    summary: "Tiêu thụ nhãn lồng tươi loại 1",
    items: ["Nhãn lồng", "Khay nhựa 2kg"],
    quantity: 40_000,
    unit: "Kg",
    value: 1_200_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2025-08-12",
    endDate: "2025-11-15",
    partner: "Chuỗi cửa hàng Fresh & Go",
    fileUrl: "/contracts/hd017.pdf",
  },
  {
    id: "HD018",
    name: "Hợp đồng mua giống cây sầu riêng",
    contractType: "Mua",
    summary: "Mua 1.000 cây giống sầu riêng Ri6 chứng nhận",
    items: ["Cây giống sầu riêng Ri6", "Chế phẩm kích rễ"],
    quantity: 1_000,
    unit: "Cây",
    value: 450_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-15",
    endDate: "2025-09-15",
    partner: "Trại giống Miền Đông",
    fileUrl: "/contracts/hd018.pdf",
  },
  {
    id: "HD019",
    name: "Hợp đồng thu tiêu thụ dừa tươi",
    contractType: "Thu",
    summary: "Cung ứng dừa xiêm xanh cho chuỗi đồ uống",
    items: ["Dừa xiêm xanh", "Ống hút giấy"],
    quantity: 60_000,
    unit: "Trái",
    value: 900_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-20",
    endDate: "2026-02-20",
    partner: "Chuỗi cửa hàng Coco&Tea",
    fileUrl: "",
  },
  {
    id: "HD020",
    name: "Hợp đồng mua vật tư đóng gói xuất khẩu",
    contractType: "Mua",
    summary: "Mua pallet gỗ và dây đai nhựa cho lô hàng EU",
    items: ["Pallet gỗ tiêu chuẩn ISPM 15", "Dây đai PET 19mm"],
    quantity: 1_200,
    unit: "Bộ",
    value: 380_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2025-08-22",
    endDate: "2025-10-31",
    partner: "BaoBì Việt Tiến",
    fileUrl: "/contracts/hd020.pdf",
  },
];

const ContractInfo = () => {
  const contractColumns: MRT_ColumnDef<Contract>[] = [
    { accessorKey: "id", header: "Mã hợp đồng" },
    { accessorKey: "name", header: "Tên hợp đồng" },
    { accessorKey: "partner", header: "Đối tác" },
    { accessorKey: "contractType", header: "Loại" },
    { accessorKey: "summary", header: "Tóm tắt nội dung" },
    {
      accessorKey: "items",
      header: "Danh sách vật tư",
      Cell: ({ row }) => row.original.items.join(", "),
    },
    { accessorKey: "quantity", header: "Sản lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    {
      accessorKey: "value",
      header: "Giá trị",
      Cell: ({ row }) =>
        `${row.original.value.toLocaleString()} ${row.original.currency}`,
    },
    { accessorKey: "status", header: "Trạng thái" },
    { accessorKey: "startDate", header: "Ngày hiệu lực" },
    { accessorKey: "endDate", header: "Ngày kết thúc" },

    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
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
    <Stack gap={"xs"} mt={"md"}>
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Danh sách hợp đồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
        </Group>
      </Group>
      <Group>
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày bắt đầu"
          radius={4}
        />
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày kết thúc"
          radius={4}
        />
        <Select
          radius={4}
          leftSection={<IconContract size={18} />}
          placeholder="Loại hợp đồng"
          data={["Thu", "Mua"]}
        />
        <Select
          radius={4}
          leftSection={<IconTypeface size={18} />}
          placeholder="Trạng thái"
          data={["Chờ duyệt", "Đang hiệu lực", "Hết hiệu lực"]}
        />
      </Group>
      <Table columns={contractColumns} data={contractData} />
    </Stack>
  );
};
export default ContractInfo;
