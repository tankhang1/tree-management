import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconPackage,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
type PackagingVariant = {
  quantity: number; // số lượng tồn theo quy cách này (ví dụ 50)
  packUnit: string; // đơn vị đóng gói: chai, gói, thùng...
  contentPerUnit: string; // dung tích/khối lượng mỗi đơn vị: 500ml, 1l, 250g...
  note?: string; // ghi chú (tuỳ chọn)
};
// --- Types ---
type Pesticide = {
  code: string;
  name: string;
  type: "TYPE01" | "TYPE02" | "TYPE03" | "TYPE04";
  unit: string; // đơn vị gốc (ml, g, lít…)
  stock: number; // tồn kho tổng (nếu muốn)
  stockUnit: string; // đơn vị tồn tổng: chai/gói/bao...
  info: string;
  ingredients: string;
  usage: string;
  variants?: PackagingVariant[]; // ✅ danh sách quy cách
};

// --- Type dictionary (hiển thị nhãn dễ hiểu) ---
const TYPE_LABEL: Record<Pesticide["type"], string> = {
  TYPE01: "Thuốc trừ sâu (Insecticide)",
  TYPE02: "Thuốc trừ bệnh (Fungicide)",
  TYPE03: "Dinh dưỡng/Phân bón lá",
  TYPE04: "Thuốc trừ cỏ (Herbicide)",
};

// --- Dataset mẫu (có thể thay bằng dữ liệu thật) ---
const pesticidesSeed: Pesticide[] = [
  {
    code: "TH001",
    name: "Thuốc trừ sâu SuperKiller",
    type: "TYPE01",
    unit: "ml",
    stock: 120,
    stockUnit: "chai",
    info: "Diệt trừ sâu cuốn lá, rầy nâu hiệu quả cao.",
    ingredients: "Chlorpyrifos Ethyl 500g/l + Cypermethrin 50g/l",
    usage: "Pha 25ml cho bình 16L, phun đều mặt lá vào sáng sớm.",
    variants: [
      { quantity: 50, packUnit: "chai", contentPerUnit: "500ml" }, // ví dụ 50 chai / 500ml
      { quantity: 1, packUnit: "thùng", contentPerUnit: "1l" }, // ví dụ 1 thùng / 1l
    ],
  },
  {
    code: "TH002",
    name: "Thuốc trừ bệnh BioShield",
    type: "TYPE02",
    unit: "g",
    stock: 75,
    stockUnit: "gói",
    info: "Đặc trị nấm hại trên cây ăn quả.",
    ingredients: "Copper Hydroxide 77%",
    usage: "Pha 20g với 8L nước, phun ướt đều thân và lá.",
    variants: [{ quantity: 75, packUnit: "gói", contentPerUnit: "20g" }],
  },
  {
    code: "TH003",
    name: "Phân bón lá GrowUp",
    type: "TYPE03",
    stock: 120,
    stockUnit: "chai",
    unit: "lít",
    info: "Cung cấp dinh dưỡng vi lượng cho cây trong giai đoạn sinh trưởng.",
    ingredients: "NPK + Bo + Zn + Mn",
    usage: "Pha 30ml/10L nước, phun định kỳ 7 ngày/lần.",
  },
  {
    code: "TH004",
    name: "HerbiClean 480SL",
    type: "TYPE04",
    stock: 120,
    stockUnit: "chai",
    unit: "lít",
    info: "Thuốc trừ cỏ không chọn lọc, diệt cỏ sau mọc.",
    ingredients: "Glyphosate IPA salt 480 g/L",
    usage: "Pha 100ml/16L, phun đều khi cỏ sinh trưởng mạnh, tránh bay drift.",
  },
  {
    code: "TH005",
    name: "Nấm đối kháng TrichoBio",
    type: "TYPE02",
    stock: 120,
    stockUnit: "gói",
    unit: "g",
    info: "Phòng trị thối rễ, nứt thân xì mủ; tăng đề kháng đất.",
    ingredients: "Trichoderma spp. ≥ 10^8 CFU/g",
    usage: "Rải 20–30g/gốc hoặc hoà nước tưới quanh vùng rễ.",
  },
  {
    code: "TH006",
    name: "Abamex 3.6EC",
    type: "TYPE01",
    stock: 432,
    stockUnit: "chai",
    unit: "ml",
    info: "Trừ nhện đỏ, bọ trĩ, sâu tơ trên rau màu.",
    ingredients: "Abamectin 36 g/L",
    usage: "Pha 10–15ml/16L, phun khi mật số sâu hại bắt đầu xuất hiện.",
  },
  {
    code: "TH007",
    stock: 120,
    name: "Ridomil Gold 68WG",
    type: "TYPE02",
    stockUnit: "gói",
    unit: "g",
    info: "Trừ bệnh thối gốc, sương mai trên cây ăn trái & rau.",
    ingredients: "Metalaxyl-M 40 g/kg + Mancozeb 640 g/kg",
    usage: "Pha 25g/16L, phun luân phiên 7–10 ngày/lần.",
  },
  {
    code: "TH008",
    name: "Confidor 100SL",
    type: "TYPE01",
    unit: "ml",

    stock: 120,
    stockUnit: "chai",
    info: "Trừ rầy mềm, rệp sáp, bọ phấn (tác động lưu dẫn).",
    ingredients: "Imidacloprid 100 g/L",
    usage: "Pha 5–7ml/16L, phun sớm khi sâu hại mới xuất hiện.",
  },
  {
    code: "TH009",
    name: "Basta 15SL",
    type: "TYPE04",
    unit: "ml",

    stock: 120,
    stockUnit: "chai",
    info: "Thuốc trừ cỏ tiếp xúc, hiệu quả nhanh.",
    ingredients: "Glufosinate-ammonium 150 g/L",
    usage:
      "Pha 60–80ml/16L, phun đều, tránh dính lên bộ phận xanh của cây trồng.",
  },
  {
    code: "TH010",
    name: "Amino Plus Leaf",
    type: "TYPE03",

    unit: "ml",
    stock: 120,
    stockUnit: "chai",
    info: "Amino + vi lượng, phục hồi cây sau thu hoạch/thuốc.",
    ingredients: "Amino acids + Zn, B, Mn, Mg",
    usage: "Pha 20–30ml/16L, phun 10–14 ngày/lần.",
  },
];

// --- Component ---
export default function PesticideInfo() {
  const [type, setType] = useState<Pesticide["type"] | null>(null);
  const [packModal, setPackModal] = useState<{
    open: boolean;
    name?: string;
    variants?: PackagingVariant[];
  }>({ open: false });
  const columns: MRT_ColumnDef<Pesticide>[] = [
    { accessorKey: "code", header: "Mã thuốc", size: 80 },
    { accessorKey: "name", header: "Tên thuốc", size: 220 },
    {
      accessorKey: "type",
      header: "Loại thuốc",
      Cell: ({ cell }) => {
        const v = cell.getValue<Pesticide["type"]>();
        const color =
          v === "TYPE01"
            ? "red"
            : v === "TYPE02"
            ? "grape"
            : v === "TYPE04"
            ? "teal"
            : "green";
        return (
          <Badge color={color} variant="light">
            {TYPE_LABEL[v]}
          </Badge>
        );
      },
      size: 200,
    },
    { accessorKey: "info", header: "Thông tin thuốc", size: 320 },
    { accessorKey: "ingredients", header: "Thành phần", size: 280 },
    { accessorKey: "usage", header: "Hướng dẫn sử dụng", size: 320 },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => {
                setPackModal({
                  open: true,
                  name: row.original.name,
                  variants: row.original.variants,
                });
              }}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => {}}
            >
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
  const variantColumns: MRT_ColumnDef<PackagingVariant>[] = [
    {
      accessorKey: "quantity",
      header: "Số lượng",
      size: 80,
    },
    {
      accessorKey: "packUnit",
      header: "Đơn vị",
      size: 100,
    },
    {
      accessorKey: "contentPerUnit",
      header: "Quy cách (mỗi đơn vị)",
      size: 140,
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      size: 200,
    },
  ];
  const data = useMemo(() => {
    const q = "";
    return pesticidesSeed.filter((p) => {
      const okType = type ? p.type === type : true;
      const okQuery =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q) ||
        p.info.toLowerCase().includes(q);
      return okType && okQuery;
    });
  }, [type]);

  return (
    <Stack mt="md">
      <Title order={3}>Danh sách thuốc bảo vệ thực vật</Title>
      <Group wrap="wrap">
        <Select
          placeholder="Lọc theo loại"
          data={[
            { value: "TYPE01", label: TYPE_LABEL.TYPE01 },
            { value: "TYPE02", label: TYPE_LABEL.TYPE02 },
            { value: "TYPE03", label: TYPE_LABEL.TYPE03 },
            { value: "TYPE04", label: TYPE_LABEL.TYPE04 },
          ]}
          clearable
          value={type}
          onChange={(v) => setType((v as Pesticide["type"]) ?? null)}
          radius={4}
          w={280}
        />
      </Group>

      <Table data={data} columns={columns} />
      <Modal
        opened={packModal.open}
        onClose={() => setPackModal({ ...packModal, open: false })}
        size="lg"
        radius={4}
        title={
          <Group gap={8}>
            <IconPackage size={18} />
            <Text fw={600}>{packModal.name}</Text>
          </Group>
        }
      >
        <Table data={packModal.variants || []} columns={variantColumns} />
      </Modal>
    </Stack>
  );
}
