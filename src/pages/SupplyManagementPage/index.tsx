import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  CloseButton,
  Divider,
  Grid,
  Group,
  List,
  Menu,
  Modal,
  MultiSelect,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
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
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useMemo, useState } from "react";

type SupplyType = {
  id: string;
  name: string;
  supplier: string;
  type: string;
};

export const supplyTypes: SupplyType[] = [
  {
    id: "VT003",
    name: "Bạt phủ nilon đen",
    supplier: "Cửa hàng Vật tư nông nghiệp Tân Phú",
    type: "Vật tư nông nghiệp",
  },
  {
    id: "VT004",
    name: "Chai nhựa 500ml",
    supplier: "CTCP Bao bì An Phát",
    type: "Vật tư đóng gói",
  },
];

const MOCK_STOCK = [
  { warehouse: "Kho Trung tâm", quantity: 1200, min: 300, location: "Kệ A-01" },
  { warehouse: "Kho Khu B", quantity: 220, min: 100, location: "Kệ B-12" },
];

const MOCK_PRICES = [
  { vendor: "Tân Phú", price: "18.500đ/m²", updatedAt: "2025-07-01" },
  { vendor: "An Phát", price: "19.000đ/m²", updatedAt: "2025-06-15" },
];

const MOCK_ATTACHMENTS = [
  { name: "Thông số kỹ thuật.pdf", size: "320 KB" },
  { name: "CO-CQ.zip", size: "2.1 MB" },
];

const SupplyManagementPage = () => {
  const navigate = useNavigate();

  const [openedSupplyDetail, setOpenedSupplyDetail] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedConfirm, setOpenedConfirm] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedSupply, setSelectedSupply] = useState<SupplyType | null>(null);
  const [editDraft, setEditDraft] = useState<SupplyType | null>(null);

  const onAddSupply = () => navigate(PATH.SUPPLY_ADD_MAIN);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return supplyTypes;
    return supplyTypes.filter(
      (x) =>
        x.id.toLowerCase().includes(kw) ||
        x.name.toLowerCase().includes(kw) ||
        x.supplier.toLowerCase().includes(kw) ||
        x.type.toLowerCase().includes(kw)
    );
  }, [keyword]);

  const openDetail = (row: SupplyType) => {
    setSelectedSupply(row);
    setOpenedSupplyDetail(true);
  };

  const startEdit = () => {
    if (!selectedSupply) return;
    setEditDraft({ ...selectedSupply });
    setOpenedEdit(true);
  };

  const confirmDelete = () => setOpenedConfirm(true);

  const saveEdit = () => {
    if (!editDraft) return;
    setSelectedSupply(editDraft);
    setOpenedEdit(false);
  };

  const supplyTypeColumns: MRT_ColumnDef<SupplyType>[] = [
    { accessorKey: "id", header: "Mã vật tư" },
    { accessorKey: "name", header: "Tên vật tư" },
    { accessorKey: "type", header: "Loại vật tư" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md" width={160}>
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => openDetail(row.original)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => {
                setSelectedSupply(row.original);
                setEditDraft({ ...row.original });
                setOpenedEdit(true);
              }}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => {
                setSelectedSupply(row.original);
                setOpenedConfirm(true);
              }}
            >
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title flex={1} order={2}>
            Quản lý vật tư
          </Title>
          <Group>
            <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
              Xuất File
            </Button>
            <Button radius={4} onClick={onAddSupply}>
              Thêm mới
            </Button>
          </Group>
        </Group>

        <Card withBorder shadow="sm" radius={4} p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Stack gap={0}>
              <Title order={4}>Tìm kiếm vật tư</Title>
              <Text c="dimmed" size="sm">
                Điền từ khóa hoặc chọn lọc loại vật tư, nhà cung cấp
              </Text>
            </Stack>
            <Group>
              <Tooltip label="Xoá tất cả bộ lọc">
                <Button
                  radius={4}
                  variant="default"
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => setKeyword("")}
                >
                  Làm mới
                </Button>
              </Tooltip>
              <Button radius={4} leftSection={<IconSearch size={16} />}>
                Lọc thông tin
              </Button>
            </Group>
          </Group>

          <Stack gap="sm">
            <TextInput
              radius={4}
              label="Khung tìm kiếm"
              description="Ví dụ: Bạt phủ nilon"
              placeholder="Nhập thông tin"
              leftSection={<IconSearch size={16} />}
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
              <MultiSelect
                radius={4}
                label="Loại vật tư"
                description="Ví dụ: Vật tư A, Vật tư B"
                placeholder="Chọn thông tin"
                data={["Vật tư nông nghiệp", "Vật tư đóng gói", "Vật tư khác"]}
              />
              <MultiSelect
                radius={4}
                label="Nhà cung cấp"
                description="Ví dụ: Nhà cung cấp A, Nhà cung cấp B"
                placeholder="Chọn thông tin"
                data={["Nhà cung cấp 1", "Nhà cung cấp 2", "Nhà cung cấp 3"]}
              />
            </SimpleGrid>

            {keyword && (
              <Group gap={8}>
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
                <ActionIcon variant="subtle" onClick={() => setKeyword("")} title="Xoá tất cả">
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            )}
          </Stack>
        </Card>

        <Table
          columns={supplyTypeColumns}
          data={filtered}
        
        />
      </Stack>

      <Modal
        opened={openedSupplyDetail}
        onClose={() => setOpenedSupplyDetail(false)}
        title="Chi tiết vật tư"
        size="lg"
        radius={4}
        centered
      >
        {selectedSupply && (
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Group>
                <Avatar radius={4} src="/supply.png" />
                <Stack gap={2}>
                  <Text fw={700}>{selectedSupply.name}</Text>
                  <Text size="sm" c="dimmed">
                    {selectedSupply.id} • {selectedSupply.type}
                  </Text>
                </Stack>
              </Group>
              <Group>
                <Button variant="default" leftSection={<IconEdit size={16} />} onClick={startEdit}>
                  Sửa
                </Button>
                <Button color="red" leftSection={<IconTrash size={16} />} onClick={confirmDelete}>
                  Xoá
                </Button>
              </Group>
            </Group>

            <Divider />

            <Tabs defaultValue="overview" keepMounted={false}>
              <Tabs.List>
                <Tabs.Tab value="overview" leftSection={<IconEye size={14} />}>
                  Tổng quan
                </Tabs.Tab>
                <Tabs.Tab value="stock">Tồn kho</Tabs.Tab>
                <Tabs.Tab value="pricing">Giá & NCC</Tabs.Tab>
                <Tabs.Tab value="files">Tệp đính kèm</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius={4} p="md">
                      <Title order={6}>Thông tin</Title>
                      <Divider my="xs" />
                      <SimpleGrid cols={2} spacing={6}>
                        <Text c="dimmed">Mã vật tư</Text>
                        <Text fw={500}>{selectedSupply.id}</Text>

                        <Text c="dimmed">Tên vật tư</Text>
                        <Text fw={500}>{selectedSupply.name}</Text>

                        <Text c="dimmed">Loại</Text>
                        <Badge>{selectedSupply.type}</Badge>

                        <Text c="dimmed">Nhà cung cấp</Text>
                        <Text fw={500}>{selectedSupply.supplier}</Text>
                      </SimpleGrid>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius={4} p="md">
                      <Title order={6}>Ghi chú nhanh</Title>
                      <Divider my="xs" />
                      <List spacing={6} size="sm" withPadding>
                        <List.Item>Ưu tiên xuất kho từ Kho Trung tâm</List.Item>
                        <List.Item>Hạn mức đặt tối thiểu 200 đơn vị/lần</List.Item>
                        <List.Item>Kiểm tra CO-CQ khi nhập hàng</List.Item>
                      </List>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="stock" pt="md">
                <Stack gap="sm">
                  {MOCK_STOCK.map((s, i) => (
                    <Paper key={i} withBorder p="sm" radius={4}>
                      <Group justify="space-between">
                        <Stack gap={2}>
                          <Text fw={600}>{s.warehouse}</Text>
                          <Text size="sm" c="dimmed">
                            Vị trí: {s.location}
                          </Text>
                        </Stack>
                        <Group>
                          <Badge variant="light">Tồn: {s.quantity}</Badge>
                          <Badge color="orange" variant="light">
                            Tối thiểu: {s.min}
                          </Badge>
                        </Group>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="pricing" pt="md">
                <Card withBorder radius={4} p="md">
                  <Title order={6}>Bảng giá gần đây</Title>
                  <Divider my="xs" />
                  <Stack gap={8}>
                    {MOCK_PRICES.map((p, i) => (
                      <Group key={i} justify="space-between">
                        <Text fw={500}>{p.vendor}</Text>
                        <Group>
                          <Badge variant="outline">{p.price}</Badge>
                          <Text size="sm" c="dimmed">
                            Cập nhật: {p.updatedAt}
                          </Text>
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel value="files" pt="md">
                <Stack gap={8}>
                  {MOCK_ATTACHMENTS.map((f, i) => (
                    <Paper key={i} withBorder radius={4} p="sm">
                      <Group justify="space-between">
                        <Text>{f.name}</Text>
                        <Badge variant="light">{f.size}</Badge>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={openedEdit}
        onClose={() => setOpenedEdit(false)}
        title="Chỉnh sửa vật tư"
        size="md"
        centered
        radius={4}
      >
        {editDraft && (
          <Stack gap="sm">
            <TextInput
              label="Mã vật tư"
              value={editDraft.id}
              onChange={(e) => setEditDraft({ ...editDraft, id: e.currentTarget.value })}
              radius={4}
            />
            <TextInput
              label="Tên vật tư"
              value={editDraft.name}
              onChange={(e) => setEditDraft({ ...editDraft, name: e.currentTarget.value })}
              radius={4}
            />
            <TextInput
              label="Loại vật tư"
              value={editDraft.type}
              onChange={(e) => setEditDraft({ ...editDraft, type: e.currentTarget.value })}
              radius={4}
            />
            <TextInput
              label="Nhà cung cấp"
              value={editDraft.supplier}
              onChange={(e) => setEditDraft({ ...editDraft, supplier: e.currentTarget.value })}
              radius={4}
            />
            <Group justify="flex-end" mt="xs">
              <Button variant="default" onClick={() => setOpenedEdit(false)} radius={4}>
                Huỷ
              </Button>
              <Button onClick={saveEdit} radius={4}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={openedConfirm}
        onClose={() => setOpenedConfirm(false)}
        title="Xác nhận xoá"
        centered
        radius={4}
      >
        <Stack>
          <Text>
            Bạn có chắc muốn xoá vật tư{" "}
            <Text span fw={700}>
              {selectedSupply?.name}
            </Text>{" "}
            ({selectedSupply?.id})?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpenedConfirm(false)} radius={4}>
              Huỷ
            </Button>
            <Button color="red" radius={4} onClick={() => setOpenedConfirm(false)}>
              Xoá
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SupplyManagementPage;
