import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  List,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Radio,
  Select,
  Stack,
  Table as MantineTable,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyList } from "../../../../components/CompanyList";

type ActiveIngredient = { name: string; concentration: string; moA?: string };
type CropUse = { crop: string; target: string; rate: string; phi: string };
type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
};
type PackageSpec = {
  code: string;
  unit: string;
  pack: string;
  barcode?: string;
};
type PriceTier = {
  pkgCode: string;
  minQty: number;
  price: number;
  currency: string;
};
type WarehouseStock = {
  warehouse: string;
  bin: string;
  onHand: number;
  reserved: number;
  uom: string;
};
type DocumentLink = { label: string; url: string };
type Pesticide = {
  id: string;
  name: string;
  brand: string;
  origin: string;
  types: string[];
  formulation: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  image: string;
  tags: string[];
  activeIngredients: ActiveIngredient[];
  crops: CropUse[];
  usageNote: string;
  dilution: string;
  rei: string;
  iracGroup?: string;
  toxicityClass: string;
  whoClass?: string;
  ppe: string[];
  hazards: string[];
  firstAid: string;
  storage: string;
  compatibility: string;
  registrationNo: string;
  registrationDate: string;
  msds: DocumentLink;
  techPdf?: DocumentLink;
  techHtml?: string;
  suppliers: Supplier[];
  packages: PackageSpec[];
  prices: PriceTier[];
  stocks: WarehouseStock[];
  audit: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    status: "Đang dùng" | "Ngưng dùng";
  };
};

const typeOptions = [
  "Thuốc trừ sâu",
  "Thuốc trừ bệnh",
  "Phân bón lá",
  "Chất kích thích sinh trưởng",
  "Hữu cơ",
  "Sinh học",
];

const tagOptions = [
  "Sinh học",
  "Hữu cơ",
  "Ít độc",
  "Mùa mưa",
  "Mùa khô",
  "Ưu tiên",
];
const uoms = ["Chai", "Lọ", "Gói", "Thùng", "Can"];

const currencyFmt = (v: number, c = "VND") =>
  v.toLocaleString("vi-VN", { style: "currency", currency: c });

const Section = ({
  title,
  onEdit,
  right,
  children,
}: {
  title: string;
  onEdit?: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card withBorder radius={4} p="md">
    <Group justify="space-between" mb="xs">
      <Title order={5}>{title}</Title>
      <Group gap="xs">
        {right}
        {onEdit && (
          <Button
            size="xs"
            radius={4}
            leftSection={<IconPencil size={14} />}
            onClick={onEdit}
          >
            Sửa
          </Button>
        )}
      </Group>
    </Group>
    <Divider my="xs" />
    {children}
  </Card>
);

export default function PesticideManagementMainDetailPage() {
  const [data, setData] = useState<Pesticide>({
    id: "TH001",
    name: "Bio-X Neem Plus 300EC",
    brand: "AgriLife",
    origin: "Việt Nam",
    types: ["Thuốc trừ sâu", "Hữu cơ", "Sinh học"],
    formulation: "EC (Emulsifiable Concentrate)",
    batchNo: "BX-2305-NEEM",
    mfgDate: "2025-03-10",
    expDate: "2027-03-10",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    tags: ["Sinh học", "Ít độc", "Ưu tiên"],
    activeIngredients: [
      { name: "Azadirachtin", concentration: "0.15%", moA: "IRAC UN" },
      { name: "Neem oil", concentration: "30%", moA: "Repellent" },
    ],
    crops: [
      {
        crop: "Lúa",
        target: "Sâu cuốn lá",
        rate: "20–25 ml/bình 16L",
        phi: "14 ngày",
      },
      {
        crop: "Xoài",
        target: "Rầy, bọ trĩ",
        rate: "25–30 ml/bình 16L",
        phi: "10 ngày",
      },
      {
        crop: "Rau cải",
        target: "Sâu tơ",
        rate: "15–20 ml/bình 16L",
        phi: "7 ngày",
      },
    ],
    usageNote:
      "Phun sáng sớm/chiều mát. Luân phiên hoạt chất để chống kháng. Không phun khi trời mưa.",
    dilution: "1:600–1:800 nước sạch",
    rei: "12 giờ",
    iracGroup: "UN – Botanical",
    toxicityClass: "Nhóm IV (Ít độc)",
    whoClass: "U (Không cấp theo WHO)",
    ppe: ["Găng tay", "Khẩu trang", "Kính bảo hộ", "Quần áo dài tay"],
    hazards: ["Gây kích ứng mắt nhẹ", "Độc với cá nước ngọt"],
    firstAid:
      "Nếu dính mắt: rửa liên tục 15 phút. Nếu nuốt: không gây nôn, đưa đến cơ sở y tế kèm nhãn.",
    storage: "Bảo quản nơi khô mát, tránh nắng, xa tầm tay trẻ em.",
    compatibility:
      "Không trộn thuốc có tính kiềm mạnh. Thử jar test trước khi phối trộn.",
    registrationNo: "VN-2-345/25/BVTV",
    registrationDate: "2025-04-05",
    msds: {
      label: "MSDS_BioX.pdf",
      url: "https://pdfobject.com/pdf/sample.pdf",
    },
    techPdf: {
      label: "HDSD_BioX.pdf",
      url: "https://pdfobject.com/pdf/sample.pdf",
    },
    techHtml:
      "<h3>Hướng dẫn nhanh</h3><ul><li>Lúa: 25 ml/bình 16L</li><li>Xoài: 30 ml/bình 16L</li></ul>",
    suppliers: [
      {
        id: "NCC01",
        name: "Công ty TNHH Nông Dược A",
        contact: "Nguyễn Văn H",
        phone: "0909 111 222",
        email: "sale@nonga.vn",
      },
      {
        id: "NCC02",
        name: "CTCP AgriCare",
        contact: "Trần Thị M",
        phone: "0912 333 444",
        email: "biz@agricare.vn",
      },
      {
        id: "NCC03",
        name: "Hợp tác xã Xanh",
        contact: "Lê Quốc P",
        phone: "0989 555 666",
        email: "contact@htx-xanh.vn",
      },
    ],
    packages: [
      { code: "PKG250", unit: "Chai", pack: "250ml", barcode: "8938502500012" },
      { code: "PKG500", unit: "Chai", pack: "500ml", barcode: "8938502500029" },
      { code: "PKG05", unit: "Can", pack: "5L", barcode: "8938502500036" },
    ],
    prices: [
      { pkgCode: "PKG250", minQty: 12, price: 35000, currency: "VND" },
      { pkgCode: "PKG250", minQty: 120, price: 32000, currency: "VND" },
      { pkgCode: "PKG500", minQty: 12, price: 62000, currency: "VND" },
      { pkgCode: "PKG05", minQty: 2, price: 580000, currency: "VND" },
    ],
    stocks: [
      {
        warehouse: "Kho Long An",
        bin: "A-01-03",
        onHand: 640,
        reserved: 120,
        uom: "Chai",
      },
      {
        warehouse: "Kho Bình Dương",
        bin: "B-12-07",
        onHand: 220,
        reserved: 20,
        uom: "Chai",
      },
      {
        warehouse: "Kho Cần Thơ",
        bin: "C-05-02",
        onHand: 35,
        reserved: 0,
        uom: "Can",
      },
    ],
    audit: {
      createdBy: "admin",
      createdAt: "2025-04-06 09:40",
      updatedBy: "manager01",
      updatedAt: "2025-08-10 15:25",
      status: "Đang dùng",
    },
  });

  const [modal, setModal] = useState<{ key: string | null }>(() => ({
    key: null,
  }));
  const [draft, setDraft] = useState<any>({});

  const openEdit = (key: string, payload?: any) => {
    setDraft(payload ?? data);
    setModal({ key });
  };
  const closeEdit = () => setModal({ key: null });

  const saveEdit = () => {
    if (modal.key === "basic") setData((p) => ({ ...p, ...draft }));
    if (modal.key === "comp")
      setData((p) => ({
        ...p,
        activeIngredients: draft.activeIngredients ?? p.activeIngredients,
        crops: draft.crops ?? p.crops,
        usageNote: draft.usageNote ?? p.usageNote,
        dilution: draft.dilution ?? p.dilution,
        rei: draft.rei ?? p.rei,
        iracGroup: draft.iracGroup ?? p.iracGroup,
      }));
    if (modal.key === "safety")
      setData((p) => ({
        ...p,
        toxicityClass: draft.toxicityClass,
        whoClass: draft.whoClass,
        ppe: draft.ppe,
        hazards: draft.hazards,
        firstAid: draft.firstAid,
        storage: draft.storage,
        compatibility: draft.compatibility,
      }));
    if (modal.key === "reg")
      setData((p) => ({
        ...p,
        registrationNo: draft.registrationNo,
        registrationDate: draft.registrationDate,
        msds: draft.msds,
        techPdf: draft.techPdf,
        techHtml: draft.techHtml,
      }));
    if (modal.key === "sup")
      setData((p) => ({
        ...p,
        suppliers: draft.suppliers ?? p.suppliers,
        packages: draft.packages ?? p.packages,
        prices: draft.prices ?? p.prices,
      }));
    if (modal.key === "stock")
      setData((p) => ({ ...p, stocks: draft.stocks ?? p.stocks }));
    closeEdit();
  };

  const supplierCols: MRT_ColumnDef<Supplier>[] = [
    { accessorKey: "id", header: "Mã NCC" },
    { accessorKey: "name", header: "Doan nghiệp/ Nông hộ" },
    { accessorKey: "contact", header: "Liên hệ" },
    { accessorKey: "phone", header: "SĐT" },
    { accessorKey: "email", header: "Email" },
  ];
  const pkgCols: MRT_ColumnDef<PackageSpec>[] = [
    { accessorKey: "code", header: "Mã quy cách" },
    { accessorKey: "unit", header: "ĐVT" },
    { accessorKey: "pack", header: "Quy cách" },
  ];
  const priceCols: MRT_ColumnDef<PriceTier>[] = [
    { accessorKey: "pkgCode", header: "Quy cách" },
    { accessorKey: "minQty", header: "SL tối thiểu" },
    {
      accessorKey: "price",
      header: "Đơn giá",
      Cell: ({ row }) => currencyFmt(row.original.price, row.original.currency),
    },
    { accessorKey: "currency", header: "Tiền tệ" },
  ];
  const stockCols: MRT_ColumnDef<WarehouseStock>[] = [
    { accessorKey: "warehouse", header: "Kho" },
    { accessorKey: "bin", header: "Vị trí" },
    { accessorKey: "onHand", header: "Tồn" },
    { accessorKey: "reserved", header: "Đã giữ" },
    { accessorKey: "uom", header: "ĐVT" },
  ];
  const navigate = useNavigate();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Group>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết thuốc BVTV</Title>
          <Group>
            <Badge
              color={data.audit.status === "Đang dùng" ? "green" : "gray"}
              variant="light"
            >
              {data.audit.status}
            </Badge>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <Section
                title="Thông tin cơ bản"
                onEdit={() =>
                  openEdit("basic", {
                    name: data.name,
                    brand: data.brand,
                    origin: data.origin,
                    types: data.types,
                    formulation: data.formulation,
                    batchNo: data.batchNo,
                    mfgDate: data.mfgDate,
                    expDate: data.expDate,
                    tags: data.tags,
                    image: data.image,
                  })
                }
                right={<Badge>{data.id}</Badge>}
              >
                <Grid align="center">
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Image
                      src={data.image}
                      radius={4}
                      h={160}
                      fit="cover"
                      alt={data.name}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Title order={4}>{data.name}</Title>
                    <Grid mt="xs">
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Thương hiệu
                        </Text>
                        <Text fw={600}>{data.brand}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Xuất xứ
                        </Text>
                        <Text fw={600}>{data.origin}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Dạng bào chế
                        </Text>
                        <Text fw={600}>{data.formulation}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Lô SX
                        </Text>
                        <Text fw={600}>{data.batchNo}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Ngày SX
                        </Text>
                        <Text fw={600}>
                          {dayjs(data.mfgDate).format("DD/MM/YYYY")}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          HSD
                        </Text>
                        <Text fw={600}>
                          {dayjs(data.expDate).format("DD/MM/YYYY")}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <Group gap="xs">
                          {data.types.map((t) => (
                            <Badge key={t} variant="light">
                              {t}
                            </Badge>
                          ))}
                          {data.tags.map((t) => (
                            <Badge key={t} color="blue" variant="outline">
                              {t}
                            </Badge>
                          ))}
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>
                </Grid>
              </Section>

              <Section
                title="Hoạt chất & Công dụng"
                onEdit={() =>
                  openEdit("comp", {
                    activeIngredients: data.activeIngredients,
                    crops: data.crops,
                    usageNote: data.usageNote,
                    dilution: data.dilution,
                    rei: data.rei,
                    iracGroup: data.iracGroup,
                  })
                }
              >
                <Title order={6}>Hướng dẫn</Title>
                <Divider my="xs" />
                <List spacing={4} size="sm">
                  <List.Item>
                    Pha loãng: <b>{data.dilution}</b>
                  </List.Item>
                  <List.Item>
                    IRAC: <b>{data.iracGroup}</b>
                  </List.Item>
                  <List.Item>
                    REI: <b>{data.rei}</b>
                  </List.Item>
                </List>
                <Box mt="xs" p="sm" bg="gray.0" style={{ borderRadius: 8 }}>
                  <Text size="sm">{data.usageNote}</Text>
                </Box>
                <Title order={6} mt="sm">
                  Liều dùng theo cây trồng
                </Title>
                <Divider my="xs" />
                <List spacing={4} size="sm">
                  {data.crops.map((c, i) => (
                    <List.Item key={i}>
                      {c.crop}: <b>{c.rate}</b>
                    </List.Item>
                  ))}
                </List>
              </Section>

              <Section
                title="Doan nghiệp/ Nông hộ & Quy cách"
                onEdit={() =>
                  openEdit("sup", {
                    suppliers: data.suppliers,
                    packages: data.packages,
                    prices: data.prices,
                  })
                }
                right={
                  <Button
                    size="xs"
                    radius={4}
                    leftSection={<IconPlus size={14} />}
                    onClick={() =>
                      openEdit("sup", {
                        suppliers: data.suppliers,
                        packages: data.packages,
                        prices: data.prices,
                      })
                    }
                  >
                    Thêm
                  </Button>
                }
              >
                <Tabs defaultValue="suppliers" keepMounted={false}>
                  <Tabs.List>
                    <Tabs.Tab value="suppliers">Doan nghiệp/ Nông hộ</Tabs.Tab>
                    <Tabs.Tab value="packages">Quy cách</Tabs.Tab>
                    <Tabs.Tab value="prices">Bảng giá</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="suppliers" pt="md">
                    <Table columns={supplierCols} data={data.suppliers} />
                  </Tabs.Panel>
                  <Tabs.Panel value="packages" pt="md">
                    <Table columns={pkgCols} data={data.packages} />
                  </Tabs.Panel>
                  <Tabs.Panel value="prices" pt="md">
                    <Table columns={priceCols} data={data.prices} />
                  </Tabs.Panel>
                </Tabs>
              </Section>

              <Section
                title="Tài liệu kỹ thuật"
                onEdit={() =>
                  openEdit("reg", {
                    registrationNo: data.registrationNo,
                    registrationDate: data.registrationDate,
                    msds: data.msds,
                    techPdf: data.techPdf,
                    techHtml: data.techHtml,
                  })
                }
              >
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={6}>Pháp lý</Title>
                    <Divider my="xs" />
                    <List spacing={4} size="sm">
                      <List.Item>
                        Số đăng ký: <b>{data.registrationNo}</b>
                      </List.Item>
                      <List.Item>
                        Ngày đăng ký:{" "}
                        <b>
                          {dayjs(data.registrationDate).format("DD/MM/YYYY")}
                        </b>
                      </List.Item>
                      <List.Item>
                        MSDS:&nbsp;
                        <a
                          href={data.msds.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {data.msds.label}
                        </a>
                      </List.Item>
                    </List>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={6}>HDSD</Title>
                    <Divider my="xs" />
                    <Tabs
                      defaultValue={data.techPdf ? "pdf" : "html"}
                      keepMounted={false}
                    >
                      <Tabs.List>
                        <Tabs.Tab value="pdf">PDF</Tabs.Tab>
                        <Tabs.Tab value="html">HTML</Tabs.Tab>
                      </Tabs.List>
                      <Tabs.Panel value="pdf" pt="sm">
                        {data.techPdf ? (
                          <Paper withBorder radius={4} p="sm" bg="gray.0">
                            <iframe
                              src={data.techPdf.url}
                              width="100%"
                              height={340}
                              style={{ border: "none", borderRadius: 6 }}
                              title="tech-pdf"
                            />
                          </Paper>
                        ) : (
                          <Text size="sm" c="dimmed">
                            Chưa có PDF
                          </Text>
                        )}
                      </Tabs.Panel>
                      <Tabs.Panel value="html" pt="sm">
                        <Paper withBorder radius={4} p="sm" bg="gray.0">
                          <Box
                            dangerouslySetInnerHTML={{
                              __html:
                                data.techHtml || "<i>Chưa có nội dung</i>",
                            }}
                          />
                        </Paper>
                      </Tabs.Panel>
                    </Tabs>
                  </Grid.Col>
                </Grid>
              </Section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              <Section
                title="An toàn & Bảo quản"
                onEdit={() =>
                  openEdit("safety", {
                    toxicityClass: data.toxicityClass,
                    whoClass: data.whoClass,
                    ppe: data.ppe,
                    hazards: data.hazards,
                    firstAid: data.firstAid,
                    storage: data.storage,
                    compatibility: data.compatibility,
                  })
                }
              >
                <List spacing={4} size="sm">
                  <List.Item>
                    Độc tính: <b>{data.toxicityClass}</b>
                  </List.Item>
                  <List.Item>
                    WHO: <b>{data.whoClass}</b>
                  </List.Item>
                  <List.Item>
                    PPE:{" "}
                    {data.ppe.map((x) => (
                      <Badge key={x} mr={6} variant="light">
                        {x}
                      </Badge>
                    ))}
                  </List.Item>
                </List>
                <Divider my="xs" />
                <Text size="sm" fw={600}>
                  Nguy cơ
                </Text>
                <List spacing={4} size="sm">
                  {data.hazards.map((h) => (
                    <List.Item key={h}>{h}</List.Item>
                  ))}
                </List>
                <Divider my="xs" />
                <Text size="sm" fw={600}>
                  Sơ cứu
                </Text>
                <Text size="sm">{data.firstAid}</Text>
                <Divider my="xs" />
                <Text size="sm" fw={600}>
                  Bảo quản
                </Text>
                <Text size="sm">{data.storage}</Text>
                <Divider my="xs" />
                <Text size="sm" fw={600}>
                  Tương hợp
                </Text>
                <Text size="sm">{data.compatibility}</Text>
              </Section>

              <Section title="Tồn kho">
                <Table columns={stockCols} data={data.stocks} />
              </Section>

              <Section title="Nhật ký">
                <List spacing={4} size="sm">
                  <List.Item>
                    Tạo bởi: <b>{data.audit.createdBy}</b> •{" "}
                    {data.audit.createdAt}
                  </List.Item>
                  <List.Item>
                    Cập nhật: <b>{data.audit.updatedBy}</b> •{" "}
                    {data.audit.updatedAt}
                  </List.Item>
                </List>
              </Section>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>

      <Modal
        opened={modal.key === "basic"}
        onClose={closeEdit}
        title="Sửa thông tin cơ bản"
        size="lg"
        radius={4}
        centered
      >
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Tên"
                defaultValue={draft.name}
                onChange={(e) =>
                  setDraft({ ...draft, name: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Thương hiệu"
                defaultValue={draft.brand}
                onChange={(e) =>
                  setDraft({ ...draft, brand: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Xuất xứ"
                defaultValue={draft.origin}
                onChange={(e) =>
                  setDraft({ ...draft, origin: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                label="Loại"
                data={typeOptions}
                defaultValue={draft.types}
                onChange={(v) => setDraft({ ...draft, types: v })}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Dạng bào chế"
                defaultValue={draft.formulation}
                onChange={(e) =>
                  setDraft({ ...draft, formulation: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Lô SX"
                defaultValue={draft.batchNo}
                onChange={(e) =>
                  setDraft({ ...draft, batchNo: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <DatePickerInput
                label="Ngày SX"
                value={new Date(draft.mfgDate)}
                onChange={(d) =>
                  d &&
                  setDraft({ ...draft, mfgDate: dayjs(d).format("YYYY-MM-DD") })
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <DatePickerInput
                label="HSD"
                value={new Date(draft.expDate)}
                onChange={(d) =>
                  d &&
                  setDraft({ ...draft, expDate: dayjs(d).format("YYYY-MM-DD") })
                }
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiSelect
                label="Tags"
                data={tagOptions}
                defaultValue={draft.tags}
                onChange={(v) => setDraft({ ...draft, tags: v })}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Ảnh (URL)"
                defaultValue={draft.image}
                onChange={(e) =>
                  setDraft({ ...draft, image: e.currentTarget.value })
                }
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button onClick={saveEdit}>Cập nhật</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={modal.key === "comp"}
        onClose={closeEdit}
        title="Sửa hoạt chất & công dụng"
        size="xl"
        radius={4}
        centered
      >
        <Stack>
          <Title order={6}>Hoạt chất</Title>
          <Stack>
            {((draft.activeIngredients as ActiveIngredient[]) || []).map(
              (a, i) => (
                <Grid key={i} align="end">
                  <Grid.Col span={5}>
                    <TextInput
                      label="Tên"
                      defaultValue={a.name}
                      onChange={(e) => {
                        const arr = [...draft.activeIngredients];
                        arr[i] = { ...a, name: e.currentTarget.value };
                        setDraft({ ...draft, activeIngredients: arr });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Nồng độ"
                      defaultValue={a.concentration}
                      onChange={(e) => {
                        const arr = [...draft.activeIngredients];
                        arr[i] = { ...a, concentration: e.currentTarget.value };
                        setDraft({ ...draft, activeIngredients: arr });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Nhóm tác động"
                      defaultValue={a.moA || ""}
                      onChange={(e) => {
                        const arr = [...draft.activeIngredients];
                        arr[i] = { ...a, moA: e.currentTarget.value };
                        setDraft({ ...draft, activeIngredients: arr });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Tooltip label="Xoá">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => {
                          const arr = [...draft.activeIngredients];
                          arr.splice(i, 1);
                          setDraft({ ...draft, activeIngredients: arr });
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Grid.Col>
                </Grid>
              )
            )}
            <Button
              size="xs"
              leftSection={<IconPlus size={14} />}
              variant="light"
              onClick={() =>
                setDraft({
                  ...draft,
                  activeIngredients: [
                    ...(draft.activeIngredients || []),
                    { name: "", concentration: "", moA: "" },
                  ],
                })
              }
            >
              Thêm hoạt chất
            </Button>
          </Stack>

          <Title order={6}>Liều dùng theo cây</Title>
          <Stack>
            {((draft.crops as CropUse[]) || []).map((c, i) => (
              <Grid key={i} align="end">
                <Grid.Col span={3}>
                  <TextInput
                    label="Cây trồng"
                    defaultValue={c.crop}
                    onChange={(e) => {
                      const arr = [...draft.crops];
                      arr[i] = { ...c, crop: e.currentTarget.value };
                      setDraft({ ...draft, crops: arr });
                    }}
                    radius={4}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    radius={4}
                    label="Đối tượng"
                    defaultValue={c.target}
                    onChange={(e) => {
                      const arr = [...draft.crops];
                      arr[i] = { ...c, target: e.currentTarget.value };
                      setDraft({ ...draft, crops: arr });
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    radius={4}
                    label="Liều lượng"
                    defaultValue={c.rate}
                    onChange={(e) => {
                      const arr = [...draft.crops];
                      arr[i] = { ...c, rate: e.currentTarget.value };
                      setDraft({ ...draft, crops: arr });
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <TextInput
                    label="PHI"
                    defaultValue={c.phi}
                    onChange={(e) => {
                      const arr = [...draft.crops];
                      arr[i] = { ...c, phi: e.currentTarget.value };
                      setDraft({ ...draft, crops: arr });
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <ActionIcon
                    radius={4}
                    variant="light"
                    color="red"
                    onClick={() => {
                      const arr = [...draft.crops];
                      arr.splice(i, 1);
                      setDraft({ ...draft, crops: arr });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Grid.Col>
              </Grid>
            ))}
            <Button
              radius={4}
              size="xs"
              leftSection={<IconPlus size={14} />}
              variant="light"
              onClick={() =>
                setDraft({
                  ...draft,
                  crops: [
                    ...(draft.crops || []),
                    { crop: "", target: "", rate: "", phi: "" },
                  ],
                })
              }
            >
              Thêm dòng
            </Button>
          </Stack>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                radius={4}
                label="Pha loãng"
                defaultValue={draft.dilution}
                onChange={(e) =>
                  setDraft({ ...draft, dilution: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                radius={4}
                label="IRAC"
                defaultValue={draft.iracGroup}
                onChange={(e) =>
                  setDraft({ ...draft, iracGroup: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                radius={4}
                label="REI"
                defaultValue={draft.rei}
                onChange={(e) =>
                  setDraft({ ...draft, rei: e.currentTarget.value })
                }
              />
            </Grid.Col>
          </Grid>
          <Textarea
            radius={4}
            label="Ghi chú sử dụng"
            minRows={2}
            defaultValue={draft.usageNote}
            onChange={(e) =>
              setDraft({ ...draft, usageNote: e.currentTarget.value })
            }
          />
          <Group justify="flex-end">
            <Button radius={4} variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button radius={4} onClick={saveEdit}>
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={modal.key === "safety"}
        onClose={closeEdit}
        title="Sửa an toàn & bảo quản"
        radius={4}
        centered
      >
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                radius={4}
                label="Độc tính"
                defaultValue={draft.toxicityClass}
                onChange={(e) =>
                  setDraft({ ...draft, toxicityClass: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="WHO"
                radius={4}
                defaultValue={draft.whoClass}
                onChange={(e) =>
                  setDraft({ ...draft, whoClass: e.currentTarget.value })
                }
              />
            </Grid.Col>
          </Grid>
          <MultiSelect
            label="PPE"
            radius={4}
            data={["Găng tay", "Khẩu trang", "Kính", "Ủng", "Áo choàng"]}
            defaultValue={draft.ppe}
            onChange={(v) => setDraft({ ...draft, ppe: v })}
            searchable
          />
          <Textarea
            label="Nguy cơ"
            minRows={2}
            radius={4}
            defaultValue={draft.hazards?.join("\n")}
            onChange={(e) =>
              setDraft({
                ...draft,
                hazards: e.currentTarget.value.split("\n").filter(Boolean),
              })
            }
          />
          <Textarea
            label="Sơ cứu"
            minRows={2}
            radius={4}
            defaultValue={draft.firstAid}
            onChange={(e) =>
              setDraft({ ...draft, firstAid: e.currentTarget.value })
            }
          />
          <Textarea
            label="Bảo quản"
            minRows={2}
            radius={4}
            defaultValue={draft.storage}
            onChange={(e) =>
              setDraft({ ...draft, storage: e.currentTarget.value })
            }
          />
          <Textarea
            label="Tương hợp"
            minRows={2}
            radius={4}
            defaultValue={draft.compatibility}
            onChange={(e) =>
              setDraft({ ...draft, compatibility: e.currentTarget.value })
            }
          />
          <Group justify="flex-end">
            <Button radius={4} variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button radius={4} onClick={saveEdit}>
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={modal.key === "reg"}
        onClose={closeEdit}
        title="Tài liệu & pháp lý"
        size="lg"
        radius={4}
        centered
      >
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                radius={4}
                label="Số đăng ký"
                defaultValue={draft.registrationNo}
                onChange={(e) =>
                  setDraft({ ...draft, registrationNo: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                radius={4}
                label="Ngày đăng ký"
                value={new Date(draft.registrationDate)}
                onChange={(d) =>
                  d &&
                  setDraft({
                    ...draft,
                    registrationDate: dayjs(d).format("YYYY-MM-DD"),
                  })
                }
              />
            </Grid.Col>
          </Grid>
          <Tabs defaultValue="pdf">
            <Tabs.List>
              <Tabs.Tab value="pdf">PDF</Tabs.Tab>
              <Tabs.Tab value="html">HTML</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="pdf" pt="sm">
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    radius={4}
                    label="MSDS label"
                    defaultValue={draft.msds?.label}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        msds: {
                          ...(draft.msds || {}),
                          label: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="MSDS URL"
                    radius={4}
                    defaultValue={draft.msds?.url}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        msds: {
                          ...(draft.msds || {}),
                          url: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    radius={4}
                    label="Tech PDF label"
                    defaultValue={draft.techPdf?.label}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        techPdf: {
                          ...(draft.techPdf || {}),
                          label: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    radius={4}
                    label="Tech PDF URL"
                    defaultValue={draft.techPdf?.url}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        techPdf: {
                          ...(draft.techPdf || {}),
                          url: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="html" pt="sm">
              <Textarea
                radius={4}
                label="Tech HTML"
                minRows={6}
                defaultValue={draft.techHtml}
                onChange={(e) =>
                  setDraft({ ...draft, techHtml: e.currentTarget.value })
                }
              />
            </Tabs.Panel>
          </Tabs>
          <Group justify="flex-end">
            <Button radius={4} variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button radius={4} onClick={saveEdit}>
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={modal.key === "sup"}
        onClose={closeEdit}
        title="Doan nghiệp/ Nông hộ & Quy cách & Giá"
        size="xl"
        radius={4}
        centered
      >
        <Stack>
          <CompanyList isMultiple />
          <Title order={6}>Quy cách</Title>
          <Table
            columns={[
              ...pkgCols,
              {
                id: "act",
                header: "",
                Cell: ({ row }) => (
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      const arr = [...(draft.packages || data.packages)];
                      arr.splice(row.index, 1);
                      setDraft({ ...draft, packages: arr });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                ),
              },
            ]}
            data={draft.packages || data.packages}
          />

          <Group>
            <Select
              radius={4}
              placeholder="ĐVT"
              data={uoms}
              onChange={(v) => setDraft({ ...draft, _punit: v })}
            />

            <TextInput
              radius={4}
              placeholder="Quy cách (ví dụ 500ml)"
              onChange={(e) =>
                setDraft({ ...draft, _ppack: e.currentTarget.value })
              }
            />

            <Button
              radius={4}
              variant="light"
              onClick={() => {
                const arr = [...(draft.packages || data.packages)];
                arr.push({
                  code: draft._pcode || "NEW",
                  unit: draft._punit || "Chai",
                  pack: draft._ppack || "—",
                });
                setDraft({
                  ...draft,
                  packages: arr,
                  _pcode: "",
                  _punit: "",
                  _ppack: "",
                });
              }}
            >
              Thêm
            </Button>
          </Group>

          <Title order={6}>Bảng giá</Title>
          <Table
            columns={[
              ...priceCols,
              {
                id: "act2",
                header: "",
                Cell: ({ row }) => (
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      const arr = [...(draft.prices || data.prices)];
                      arr.splice(row.index, 1);
                      setDraft({ ...draft, prices: arr });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                ),
              },
            ]}
            data={draft.prices || data.prices}
          />
          <Grid>
            <Grid.Col span={3}>
              <Select
                placeholder="Quy cách"
                data={(draft.packages || data.packages).map(
                  (p: PackageSpec) => ({ value: p.code, label: p.code })
                )}
                onChange={(v) => setDraft({ ...draft, _pkgCode: v })}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                placeholder="SL tối thiểu"
                onChange={(v) =>
                  setDraft({ ...draft, _minQty: Number(v) || 0 })
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                placeholder="Đơn giá (VND)"
                thousandSeparator
                onChange={(v) => setDraft({ ...draft, _price: Number(v) || 0 })}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <Button
                fullWidth
                variant="light"
                onClick={() => {
                  const arr = [...(draft.prices || data.prices)];
                  arr.push({
                    pkgCode: draft._pkgCode || "PKG",
                    minQty: draft._minQty || 1,
                    price: draft._price || 0,
                    currency: "VND",
                  });
                  setDraft({
                    ...draft,
                    prices: arr,
                    _pkgCode: "",
                    _minQty: 0,
                    _price: 0,
                  });
                }}
              >
                Thêm
              </Button>
            </Grid.Col>
          </Grid>

          <Group justify="flex-end">
            <Button variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button onClick={saveEdit}>Cập nhật</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={modal.key === "stock"}
        onClose={closeEdit}
        title="Sửa tồn kho"
        size="lg"
        radius={4}
        centered
      >
        <Stack>
          <Table
            columns={[
              ...stockCols,
              {
                id: "del",
                header: "",
                Cell: ({ row }) => (
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      const arr = [...(draft.stocks || data.stocks)];
                      arr.splice(row.index, 1);
                      setDraft({ ...draft, stocks: arr });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                ),
              },
            ]}
            data={draft.stocks || data.stocks}
          />
          <Grid>
            <Grid.Col span={3}>
              <TextInput
                placeholder="Kho"
                onChange={(e) =>
                  setDraft({ ...draft, _wh: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInput
                placeholder="Vị trí"
                onChange={(e) =>
                  setDraft({ ...draft, _bin: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                placeholder="Tồn"
                onChange={(v) => setDraft({ ...draft, _on: Number(v) || 0 })}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                placeholder="Đã giữ"
                onChange={(v) => setDraft({ ...draft, _rv: Number(v) || 0 })}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Select
                placeholder="ĐVT"
                data={uoms}
                onChange={(v) => setDraft({ ...draft, _uom: v })}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <Button
                fullWidth
                variant="light"
                onClick={() => {
                  const arr = [...(draft.stocks || data.stocks)];
                  arr.push({
                    warehouse: draft._wh || "Kho mới",
                    bin: draft._bin || "-",
                    onHand: draft._on || 0,
                    reserved: draft._rv || 0,
                    uom: draft._uom || "Chai",
                  });
                  setDraft({
                    ...draft,
                    stocks: arr,
                    _wh: "",
                    _bin: "",
                    _on: 0,
                    _rv: 0,
                    _uom: "",
                  });
                }}
              >
                Thêm
              </Button>
            </Grid.Col>
          </Grid>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button onClick={saveEdit}>Cập nhật</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}
