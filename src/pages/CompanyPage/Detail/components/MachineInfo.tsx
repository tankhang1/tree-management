import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconFileText,
  IconTools,
  IconTrash,
  IconEdit,
  IconLink,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";

// --- Types ---
type Supplier = {
  id: string;
  name: string;
  phone: string;
  email: string;
  unit?: string;
  specification?: string;
  quantity?: number | string;
  note?: string;
};

type TechDoc = {
  kind: "pdf" | "html";
  title: string;
  url?: string;
  content?: string; // for html kind
};

type Machine = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  image?: string;
  suppliers?: Supplier[];
  technicalDocs?: TechDoc[];
};
type MachineDetail = {
  id: string;
  name: string;
  status?: string;
  suppliers?: Supplier;
  note: string;
};

// --- Sample dataset (prefilled) ---
const machinesSeed: Machine[] = [
  {
    id: "M001",
    name: "Máy cày Kubota L5018",
    type: "Máy kéo",
    quantity: 5,
    image:
      "https://kubotataydo.com/wp-content/uploads/2020/09/danh-gia-tong-quan-may-keo-l5018vn-4.jpg",
    suppliers: [
      {
        id: "SUP001",
        name: "Công ty Thiết bị Nông nghiệp DEF",
        phone: "+84 28 3888 8888",
        email: "sales@def-agri.vn",
        unit: "Cái",
        specification: "24HP, 4WD",
        quantity: 2,
        note: "Bảo hành 12 tháng",
      },
    ],
    technicalDocs: [
      {
        kind: "pdf",
        title: "Manual Kubota L5018",
        url: "https://kubota.vn/UploadImages/Filedown/L3218DT_L4018DT.pdf",
      },
    ],
  },
  {
    id: "M002",
    name: "Máy sấy thăng hoa 50kg",
    type: "Máy sấy",
    quantity: 1,
    image:
      "https://dienmayviteko.com/pic/Product/may-say-thang-hoa-50kg-3_4658_HasThumb.webp",
    suppliers: [
      {
        id: "SUP002",
        name: "FreezeDry Tech JSC",
        phone: "+84 24 3222 2222",
        email: "support@freezedry.vn",
        unit: "Bộ",
        specification: "50kg/mẻ",
        quantity: 1,
        note: "Hợp đồng HD014",
      },
    ],
    technicalDocs: [
      {
        kind: "html",
        title: "Quy trình bảo trì",
        content: `
        <h2>Quy trình bảo trì máy sấy thăng hoa 50kg</h2>
<p><strong>Mục đích:</strong> Duy trì hiệu suất sấy ổn định, đảm bảo độ chân không/ nhiệt độ theo thiết kế và kéo dài tuổi thọ thiết bị.</p>

<h3>1) Phạm vi & đối tượng</h3>
<ul>
  <li>Áp dụng cho máy sấy thăng hoa công suất ~50kg/mẻ, buồng sấy có kệ gia nhiệt, bơm chân không cánh gạt dầu, dàn ngưng tụ băng.</li>
  <li>Thực hiện bởi kỹ thuật viên đã được đào tạo, có hồ sơ vận hành thiết bị.</li>
</ul>

<h3>2) An toàn</h3>
<ul>
  <li>Ngắt nguồn chính & treo thẻ khóa (LOTO) trước khi mở nắp tủ điện, can thiệp cơ khí.</li>
  <li>Đợi áp suất về 0 kPa (môi trường) trước khi mở buồng; bề mặt có thể nóng/lạnh sâu, đeo găng & kính bảo hộ.</li>
  <li>Không hơ nóng trực tiếp lên gioăng/ống chân không. Xử lý dầu bơm như chất thải nguy hại theo quy định.</li>
</ul>

<h3>3) Dụng cụ & vật tư</h3>
<ul>
  <li>Bộ lục giác, cờ lê lực, tua vít cách điện.</li>
  <li>Đồng hồ đo chân không (mTorr), nhiệt kế hồng ngoại.</li>
  <li>Dầu bơm chân không ISO VG 68/100 theo khuyến nghị hãng; mỡ chân không (silicone/Apiezon M) cho O‑ring.</li>
  <li>Giẻ không xơ, cồn isopropyl 70%, dung dịch trung tính pH~7.</li>
  <li>Phin lọc gió/HEPA, O‑ring cửa/van dự phòng, cầu chì dự phòng.</li>
</ul>

<h3>4) Tần suất bảo trì</h3>
<ul>
  <li><strong>Hàng ngày (trước/sau mẻ):</strong> kiểm tra tổng quát, vệ sinh buồng/kệ, kiểm tra mức & màu dầu bơm, làm tan băng dàn ngưng, ghi sổ.</li>
  <li><strong>Hàng tuần:</strong> vệ sinh/đổi lọc gió sơ cấp, kiểm tra rò rỉ, siết lại đầu nối chân không/nhiệt, bôi mỡ O‑ring.</li>
  <li><strong>Hàng tháng:</strong> thay dầu bơm (hoặc sớm hơn nếu dầu sẫm/milky), test kín (vacuum rise test), hiệu chuẩn nhanh cảm biến nhiệt.</li>
  <li><strong>Hàng quý:</strong> vệ sinh dàn ngưng & quạt, kiểm tra điện trở gia nhiệt/kết nối, kiểm tra cảm biến áp/ nhiệt, đánh giá hiệu năng kéo chân không.</li>
  <li><strong>Hàng năm:</strong> đại tu bơm (lọc hút, phớt, tẩy cặn), thay O‑ring chính, hiệu chuẩn chuẩn hóa cảm biến theo tiêu chuẩn.</li>
</ul>

<h3>5) Quy trình chi tiết</h3>
<h4>5.1 Trước khi vận hành</h4>
<ol>
  <li>Quan sát tổng thể: tìm dấu rò dầu/ nước/ môi chất; nghe tiếng bất thường.</li>
  <li>Kiểm tra mức dầu bơm trong vạch MIN‑MAX; nếu đục/màu sẫm → thay ngay.</li>
  <li>Vệ sinh kệ/khay/buồng bằng khăn không xơ + cồn 70% (tránh ướt đẫm giắc điện).</li>
  <li>Vệ sinh gioăng cửa bằng khăn ẩm; bôi một lớp <em>mỏng</em> mỡ chân không nếu khô.</li>
  <li>Đảm bảo van xả ngưng, van khí nạp về trạng thái đóng theo SOP vận hành.</li>
</ol>

<h4>5.2 Trong khi vận hành</h4>
<ol>
  <li>Theo dõi chân không đạt &lt; 1000 mTorr (1,3 mbar) trong thời gian kéo xuống tiêu chuẩn; theo thiết kế tối ưu &lt; 200 mTorr.</li>
  <li>Giám sát nhiệt độ kệ theo profile (±2°C); chênh lệch lớn → kiểm tra tiếp điểm/SSR.</li>
  <li>Ghi nhận tiếng ồn lạ, rung → tạm dừng, kiểm tra quạt, bơm, khớp nối.</li>
</ol>

<h4>5.3 Sau khi vận hành</h4>
<ol>
  <li>Đưa máy về áp suất môi trường; mở chu trình <strong>defrost</strong> tan băng dàn ngưng theo hướng dẫn.</li>
  <li>Xả nước ngưng/đá tan, vệ sinh khay thu; không để đọng nước trong buồng.</li>
  <li>Vệ sinh bề mặt trong buồng/kệ; lau khô; mở cửa hé 10–15 phút để thoáng.</li>
  <li>Kiểm tra mức dầu bơm; châm đến mức chuẩn nếu thiếu.</li>
  <li>Ghi sổ vận hành: mẻ, thời gian, chân không tối ưu, bất thường & xử lý.</li>
</ol>

<h4>5.4 Bảo trì hàng tuần</h4>
<ol>
  <li>Tháo & vệ sinh <em>lọc gió sơ cấp</em>; thay nếu bẩn/rách.</li>
  <li>Kiểm tra siết chặt các đầu nối chân không (ống mềm, co nối, van). Không siết quá lực.</li>
  <li>Kiểm tra mòn/biến dạng của gioăng cửa & O‑ring van; thay nếu nứt, chai.</li>
  <li>Bôi mỡ chân không mỏng lên O‑ring; không để dính lên bề mặt gia nhiệt.</li>
</ol>

<h4>5.5 Bảo trì hàng tháng</h4>
<ol>
  <li><strong>Thay dầu bơm</strong>: chạy máy 5–10 phút cho ấm, tắt nguồn, xả dầu, châm dầu mới đến vạch chuẩn. Xử lý dầu thải đúng quy định.</li>
  <li><strong>Vacuum rise test</strong>: bơm xuống &lt; 200 mTorr, cô lập buồng, theo dõi tăng áp trong 10 phút. Tăng &lt; 100 mTorr/phút: đạt; nếu hơn → kiểm tra rò.</li>
  <li>Kiểm tra/siết lại đầu cáp, domino, cực SSR/contactor; nhìn phát nhiệt/cháy xém.</li>
  <li>Hiệu chuẩn nhanh cảm biến nhiệt bằng chuẩn đối chiếu (nước đá 0°C hoặc block chuẩn).</li>
</ol>

<h4>5.6 Bảo trì hàng quý</h4>
<ol>
  <li>Vệ sinh dàn ngưng & quạt gió; thổi bụi, làm sạch cánh tản nhiệt.</li>
  <li>Kiểm tra hệ thống lạnh (rò rỉ dầu tại co nối → nghi rò môi chất, liên hệ hãng).</li>
  <li>Đánh giá hiệu năng kéo chân không: thời gian đạt 500 mTorr từ khí quyển; so với mốc xuất xưởng.</li>
  <li>Kiểm tra cách điện gia nhiệt & dây cảm biến bằng đồng hồ cách điện nếu có.</li>
</ol>

<h4>5.7 Bảo trì hàng năm</h4>
<ol>
  <li>Đại tu bơm: thay lọc hút, phớt trục, kiểm tra cánh gạt/rotor; thử kín sau lắp.</li>
  <li>Thay mới gioăng cửa chính & O‑ring van chính.</li>
  <li>Hiệu chuẩn chuẩn hóa cảm biến áp suất/ nhiệt độ tại đơn vị được công nhận (nếu yêu cầu).</li>
  <li>Cập nhật firmware (nếu nhà sản xuất khuyến nghị) sau khi sao lưu cấu hình.</li>
</ol>

<h3>6) Tiêu chí chấp nhận sau bảo trì</h3>
<ul>
  <li>Chân không không tải đạt ≤ 200 mTorr trong thời gian tiêu chuẩn của máy.</li>
  <li>Rò rỉ: vacuum rise ≤ 100 mTorr/phút trong 10 phút thử.</li>
  <li>Độ đồng đều nhiệt kệ trong ±2°C ở dải 0…+40°C.</li>
</ul>
<h3>8) Phụ lục – Vật tư thay thế khuyến nghị</h3>
<ul>
  <li>Dầu bơm chân không ISO VG 68 (hoặc theo hãng bơm).</li>
  <li>O‑ring cửa: NBR/Viton theo kích thước máy; O‑ring van xả/van khí nạp.</li>
  <li>Lọc gió/HEPA phòng máy (nếu có), cầu chì 10–30A theo sơ đồ tủ điện.</li>
</ul>`,
      },
    ],
  },
  {
    id: "M003",
    quantity: 1,
    name: "Xe tải lạnh 5 tấn",
    type: "Xe tải",
    image:
      "https://isuzumiendong.com/wp-content/uploads/2022/04/xe-tai-dong-lanh-isuzu-nqr-550-5-tan-h2.jpg",
    suppliers: [
      {
        id: "SUP003",
        name: "LogiCool Express",
        phone: "+84 909 123 456",
        email: "cs@logicool.vn",
        unit: "Chiếc",
        specification: "Thùng lạnh -20°C",
        quantity: 1,
      },
    ],
    technicalDocs: [
      { kind: "pdf", title: "Sổ tay xe lạnh", url: "/docs/refer-truck.pdf" },
    ],
  },
  {
    id: "M004",
    quantity: 1,
    name: "Máy bơm tăng áp tưới nhỏ giọt",
    type: "Thiết bị tưới",
    image:
      "https://florain.vn/wp-content/uploads/2019/04/may-bom-tang-ap-luc-mini-phun-suong-tuoi-lan-cay.jpg",
    suppliers: [
      {
        id: "SUP004",
        name: "AgriTech Solutions",
        phone: "+84 28 3666 9999",
        email: "hello@agritech.vn",
        unit: "Bộ",
        specification: "3HP, 220V, lọc cát",
        quantity: 1,
      },
    ],
    technicalDocs: [
      {
        kind: "html",
        title: "Ghi chú kỹ thuật",
        content: "<p>Kiểm tra rò rỉ mỗi 2 tuần.</p>",
      },
    ],
  },
  {
    quantity: 1,
    id: "M005",
    name: "Máy kéo mini Yanmar 24HP",
    type: "Máy kéo",
    image:
      "https://static.sieuthimaynongnghiep.vn/Uploaded/2015_11_09/large-ef494t-rotovator_IMHK.jpg",
    suppliers: [
      {
        id: "SUP005",
        name: "Cơ khí Đồng Tâm",
        phone: "+84 28 3456 7890",
        email: "contact@dongtam.vn",
        unit: "Cái",
        specification: "24HP",
        quantity: 2,
      },
    ],
    technicalDocs: [],
  },
];
const listMachine: MachineDetail[] = [
  {
    id: "M001",
    name: "Máy cày Kubota L5018",
    status: "Hoạt động",
    note: "Bảo trì định kỳ 6 tháng",
    suppliers: {
      id: "SUP001",
      name: "Công ty TNHH ABC",
      phone: "+84 28 1234 5678",
      email: "info@abc.com",
      unit: "Cái",
      specification: "24HP",
      quantity: 2,
    },
  },
  {
    id: "M002",
    name: "Máy cày Kubota L5018",
    status: "Bảo trì",
    note: "Bảo trì định kỳ 6 tháng",
    suppliers: {
      id: "SUP002",
      name: "Công ty TNHH XYZ",
      phone: "+84 28 9876 5432",
      email: "support@xyz.com",
      unit: "Bộ",
      specification: "50kg/mẻ",
      quantity: 1,
    },
  },
  {
    id: "M003",
    name: "Máy cày Kubota L5018",
    status: "Hoạt động",
    note: "Bảo trì định kỳ 6 tháng",
    suppliers: {
      id: "SUP003",
      name: "Công ty TNHH DEF",
      phone: "+84 28 5555 6666",
      email: "info@def.com",
      unit: "Chiếc",
      specification: "Thùng lạnh -20°C",
      quantity: 1,
    },
  },
  {
    id: "M004",
    name: "Máy cày Kubota L5018",
    status: "Hoạt động",
    note: "Bảo trì định kỳ 6 tháng",
    suppliers: {
      id: "SUP004",
      name: "Công ty TNHH GHI",
      phone: "+84 28 4444 3333",
      email: "contact@ghi.com",
      unit: "Bộ",
      specification: "3HP, 220V, lọc cát",
      quantity: 1,
    },
  },
  {
    id: "M005",
    name: "Máy cày Kubota L5018",
    status: "Chờ bàn giao",
    note: "Bảo trì định kỳ 6 tháng",
    suppliers: {
      id: "SUP005",
      name: "Công ty TNHH JKL",
      phone: "+84 28 2222 1111",
      email: "sales@jkl.com",
      unit: "Cái",
      specification: "24HP",
      quantity: 2,
    },
  },
];

function TechDocModal({
  opened,
  onClose,
  docs,
}: {
  opened: boolean;
  onClose: () => void;
  docs?: TechDoc[];
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius={4}
      title={
        <Group gap={8}>
          <IconFileText size={18} />
          <Text fw={600}>Tài liệu kỹ thuật</Text>
        </Group>
      }
    >
      <Stack gap="sm">
        {(docs || []).length === 0 && <Text c="dimmed">Chưa có tài liệu.</Text>}
        {(docs || []).map((d, i) => (
          <Card key={i} withBorder radius={4} p="md">
            <Group justify="space-between" align="center">
              <Group gap={8}>
                <IconFileText size={18} />
                <Text fw={600}>{d.title}</Text>
                <Badge variant="light">{d.kind.toUpperCase()}</Badge>
              </Group>
              {d.url && (
                <Tooltip label="Mở tài liệu trong tab mới">
                  <ActionIcon
                    component="a"
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtle"
                  >
                    <IconEye size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            {d.kind === "html" && d.content && (
              <Card.Section inheritPadding mt="sm">
                <div dangerouslySetInnerHTML={{ __html: d.content }} />
              </Card.Section>
            )}
            {d.kind === "pdf" && d.url && (
              <Card.Section inheritPadding mt="sm">
                <iframe
                  src={d.url}
                  width="100%"
                  height={360}
                  style={{
                    border: "1px solid var(--mantine-color-gray-3)",
                    borderRadius: 8,
                  }}
                />
              </Card.Section>
            )}
          </Card>
        ))}
      </Stack>
    </Modal>
  );
}

// --- Main list ---
export default function MachineInfo() {
  const [machines] = useState<Machine[]>(machinesSeed);

  const [docsModal, setDocsModal] = useState<{
    open: boolean;
    docs?: TechDoc[];
  }>({ open: false });
  const [openedDetail, setOpenedDetail] = useState(false);
  const machineColumns: MRT_ColumnDef<Machine>[] = [
    {
      accessorKey: "image",
      header: "Hình ảnh",
      Cell: ({ cell }) =>
        cell.getValue<string>() ? (
          <img src={cell.getValue<string>()} alt="Hình máy" width={48} />
        ) : null,
    },
    { accessorKey: "name", header: "Tên máy" },
    { accessorKey: "type", header: "Loại" },
    {
      accessorKey: "quantity",
      header: "Số lượng",
    },
    {
      accessorKey: "technicalDocs",
      header: "Tài liệu kỹ thuật",

      Cell: ({ row }) => (
        <Button
          variant="transparent"
          onClick={() =>
            setDocsModal({ open: true, docs: row.original.technicalDocs })
          }
          style={{
            border: "none",
          }}
        >
          <Group>
            <IconLink size={18} />
            <Text>Tài liệu</Text>
          </Group>
        </Button>
      ),
    },
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => setOpenedDetail(true)}
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
  const machineDetailColumns: MRT_ColumnDef<MachineDetail>[] = [
    { accessorKey: "id", header: "Mã máy" },
    { accessorKey: "name", header: "Tên máy" },
    { accessorKey: "status", header: "Trạng thái" },
    {
      accessorKey: "suppliers",
      header: "Nhà cung cấp",
      Cell: ({ cell }) =>
        cell.getValue() ? (cell.getValue() as Supplier).name : "—",
    },
    { accessorKey: "note", header: "Ghi chú" },
  ];
  return (
    <Stack mt={"md"}>
      <Stack gap="xs">
        <Title order={3}>Danh sách máy móc</Title>
        <Group>
          <Select
            searchable
            clearable
            placeholder="Loại máy"
            data={["Máy kéo", "Máy sấy", "Xe tải", "Thiết bị tưới"]}
            radius={4}
          />
          <Select
            searchable
            clearable
            placeholder="Trạng thái"
            data={["Hoạt động", "Bảo trì", "Chờ bàn giao"]}
            radius={4}
          />
        </Group>
      </Stack>

      <Table data={machines} columns={machineColumns} />

      <TechDocModal
        opened={docsModal.open}
        onClose={() => setDocsModal({ open: false })}
        docs={docsModal.docs}
      />

      <Modal
        opened={openedDetail}
        onClose={() => setOpenedDetail(false)}
        size="lg"
        radius={4}
        title={
          <Group gap={8}>
            <IconTools size={18} />
            <Text fw={600}>Danh sách máy móc</Text>
          </Group>
        }
      >
        <Table data={listMachine} columns={machineDetailColumns} />
      </Modal>
    </Stack>
  );
}
