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
  LoadingOverlay,
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
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useSupplyStore, type Supply } from "../zustand/supplyStore";

// IMPORT STORE (Đảm bảo đường dẫn đúng với cấu trúc dự án của bạn)

const SupplyManagementPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  // Lấy danh sách và các hàm thao tác từ Store
  const { supplies, deleteSupply, updateSupply, isLoading } = useSupplyStore();

  // UI States (Quản lý ẩn/hiện Modal)
  const [openedSupplyDetail, setOpenedSupplyDetail] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedConfirm, setOpenedConfirm] = useState(false);

  // Filter States (Quản lý bộ lọc)
  const [keyword, setKeyword] = useState("");
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterSuppliers, setFilterSuppliers] = useState<string[]>([]);

  // Action States (Lưu đối tượng đang được chọn để xem/sửa/xóa)
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [editDraft, setEditDraft] = useState<Supply | null>(null);

  // Chuyển hướng sang trang Thêm mới
  const onAddSupply = () => navigate(PATH.SUPPLY_ADD_MAIN);

  // 2. LOGIC FILTER
  const filtered = useMemo(() => {
    return supplies.filter((item) => {
      const kw = keyword.trim().toLowerCase();

      // Lọc theo từ khóa
      const matchKeyword =
        !kw ||
        item.id.toLowerCase().includes(kw) ||
        item.name.toLowerCase().includes(kw) ||
        //@ts-expect-error no check
        item.supplier.toLowerCase().includes(kw) ||
        item.type.toLowerCase().includes(kw);

      // Lọc theo Loại
      const matchType =
        filterTypes.length === 0 || filterTypes.includes(item.type);

      // Lọc theo Nhà cung cấp
      const matchSupplier =
        filterSuppliers.length === 0 || filterSuppliers.includes(item.supplier);

      return matchKeyword && matchType && matchSupplier;
    });
  }, [supplies, keyword, filterTypes, filterSuppliers]);

  // --- HANDLERS (XỬ LÝ SỰ KIỆN) ---

  const openDetail = (row: Supply) => {
    setSelectedSupply(row);
    setOpenedSupplyDetail(true);
  };

  const startEdit = () => {
    if (!selectedSupply) return;
    setEditDraft({ ...selectedSupply }); // Copy dữ liệu sang bản nháp để sửa
    setOpenedEdit(true);
  };

  const handleDelete = () => {
    if (selectedSupply) {
      deleteSupply(selectedSupply.id); // Gọi hàm xóa từ Store
      notifications.show({
        title: "Thành công",
        message: "Đã xóa vật tư khỏi hệ thống",
        color: "green",
        icon: <IconCheck />,
      });
      setOpenedConfirm(false);
      setOpenedSupplyDetail(false); // Đóng modal chi tiết nếu đang mở
    }
  };

  const handleSaveEdit = async () => {
    if (!editDraft) return;

    // Gọi hàm update từ Store (đã bổ sung ở bước trước)
    const success = await updateSupply(editDraft.id, editDraft);

    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Cập nhật thông tin vật tư thành công",
        color: "green",
        icon: <IconCheck />,
      });
      setOpenedEdit(false);
      setSelectedSupply(editDraft); // Cập nhật lại modal chi tiết để hiển thị dữ liệu mới
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi cập nhật",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  // Reset bộ lọc
  const handleResetFilter = () => {
    setKeyword("");
    setFilterTypes([]);
    setFilterSuppliers([]);
  };

  // Tạo danh sách Unique cho Select Filter
  const typeOptions = useMemo(
    () => Array.from(new Set(supplies.map((s) => s.type))),
    [supplies]
  );
  const supplierOptions = useMemo(
    () => Array.from(new Set(supplies.map((s) => s.supplier))),
    [supplies]
  );

  // Cấu hình cột bảng
  const columns: MRT_ColumnDef<Supply>[] = [
    {
      accessorKey: "id",
      header: "Mã vật tư",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    { accessorKey: "name", header: "Tên vật tư", size: 200 },
    {
      accessorKey: "type",
      header: "Loại vật tư",
      Cell: ({ cell }) => (
        <Badge variant="outline" color="blue">
          {cell.getValue<string>()}
        </Badge>
      ),
    },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" width={160} position="bottom-end">
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
        {/* HEADER */}
        <Group justify="space-between">
          <Title flex={1} order={2}>
            Quản lý vật tư
          </Title>
          <Group>
            <Button
              variant="outline"
              radius={4}
              leftSection={<IconFileExcel size={18} />}
            >
              Xuất Excel
            </Button>
            <Button
              radius={4}
              onClick={onAddSupply}
              leftSection={<IconPlus size={18} />}
            >
              Thêm mới
            </Button>
          </Group>
        </Group>

        {/* FILTER CARD */}
        <Card withBorder shadow="sm" radius={4} p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Stack gap={0}>
              <Title order={4}>Tìm kiếm vật tư</Title>
              <Text c="dimmed" size="sm">
                Lọc theo tên, mã, loại hoặc nhà cung cấp
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
              <Button radius={4} leftSection={<IconSearch size={16} />}>
                Tìm kiếm
              </Button>
            </Group>
          </Group>

          <Stack gap="sm">
            <TextInput
              radius={4}
              label="Khung tìm kiếm"
              description="Nhập tên vật tư hoặc mã vật tư"
              placeholder="Ví dụ: Bạt phủ..."
              leftSection={<IconSearch size={16} />}
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
              <MultiSelect
                radius={4}
                label="Loại vật tư"
                placeholder="Chọn loại"
                data={typeOptions}
                value={filterTypes}
                onChange={setFilterTypes}
                searchable
                clearable
              />
              <MultiSelect
                radius={4}
                label="Nhà cung cấp"
                placeholder="Chọn nhà cung cấp"
                data={supplierOptions}
                value={filterSuppliers}
                onChange={setFilterSuppliers}
                searchable
                clearable
              />
            </SimpleGrid>
          </Stack>
        </Card>

        {/* TABLE */}
        <Table
          //@ts-expect-error no check
          columns={columns}
          //@ts-expect-error no check
          data={filtered}
        />
      </Stack>

      {/* --- MODAL CHI TIẾT --- */}
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
                <Avatar
                  radius={4}
                  src={selectedSupply.image || ""}
                  size="lg"
                  color="blue"
                >
                  {selectedSupply.name.charAt(0)}
                </Avatar>
                <Stack gap={2}>
                  <Text fw={700} size="lg">
                    {selectedSupply.name}
                  </Text>
                  <Group gap={6}>
                    <Badge variant="light">{selectedSupply.id}</Badge>
                    <Badge variant="outline" color="gray">
                      {selectedSupply.type}
                    </Badge>
                  </Group>
                </Stack>
              </Group>
              <Group>
                <Button
                  variant="default"
                  leftSection={<IconEdit size={16} />}
                  onClick={startEdit}
                >
                  Sửa
                </Button>
                <Button
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => setOpenedConfirm(true)}
                >
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
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius={4} p="md">
                      <Title order={6}>Thông tin</Title>
                      <Divider my="xs" />
                      <SimpleGrid cols={1} spacing={6}>
                        <Group justify="space-between">
                          <Text c="dimmed">Mã vật tư</Text>
                          <Text fw={500}>{selectedSupply.id}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text c="dimmed">Tên vật tư</Text>
                          <Text fw={500}>{selectedSupply.name}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text c="dimmed">Loại</Text>
                          <Text>{selectedSupply.type}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text c="dimmed">NCC Chính</Text>
                          <Text fw={500} c="blue">
                            {selectedSupply.supplier}
                          </Text>
                        </Group>
                      </SimpleGrid>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius={4} p="md">
                      <Title order={6}>Ghi chú</Title>
                      <Divider my="xs" />
                      <Text size="sm">
                        {selectedSupply.note || "Không có ghi chú"}
                      </Text>
                      {selectedSupply.hashtags && (
                        <Group gap={4} mt="xs">
                          {selectedSupply.hashtags.map((tag) => (
                            <Badge key={tag} size="sm" variant="dot">
                              {tag}
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </Card>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="stock" pt="md">
                <Stack gap="sm">
                  {/* Render dữ liệu tồn kho thực tế nếu có trong object supply */}
                  {selectedSupply.stocks?.length ? (
                    selectedSupply.stocks.map((s, i) => (
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
                              Min: {s.min}
                            </Badge>
                          </Group>
                        </Group>
                      </Paper>
                    ))
                  ) : (
                    <Text c="dimmed" fs="italic" ta="center" py="md">
                      Chưa có dữ liệu tồn kho
                    </Text>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="pricing" pt="md">
                <Card withBorder radius={4} p="md">
                  <Title order={6}>Bảng giá</Title>
                  <Divider my="xs" />
                  <Stack gap={8}>
                    {selectedSupply.prices?.length ? (
                      selectedSupply.prices.map((p, i) => (
                        <Group key={i} justify="space-between">
                          <Text fw={500}>{p.vendor}</Text>
                          <Group>
                            <Badge variant="outline">{p.price}</Badge>
                            <Text size="sm" c="dimmed">
                              Cập nhật: {p.updatedAt}
                            </Text>
                          </Group>
                        </Group>
                      ))
                    ) : (
                      <Text c="dimmed" fs="italic" ta="center" py="md">
                        Chưa có lịch sử giá
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        )}
      </Modal>

      {/* --- MODAL EDIT --- */}
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
            <LoadingOverlay visible={isLoading} />
            <TextInput
              label="Mã vật tư"
              value={editDraft.id}
              onChange={(e) =>
                setEditDraft({ ...editDraft, id: e.currentTarget.value })
              }
              radius={4}
              disabled // Không cho sửa ID để đảm bảo toàn vẹn dữ liệu
            />
            <TextInput
              label="Tên vật tư"
              value={editDraft.name}
              onChange={(e) =>
                setEditDraft({ ...editDraft, name: e.currentTarget.value })
              }
              radius={4}
            />
            <TextInput
              label="Loại vật tư"
              value={editDraft.type}
              onChange={(e) =>
                setEditDraft({ ...editDraft, type: e.currentTarget.value })
              }
              radius={4}
            />
            <TextInput
              label="Nhà cung cấp chính"
              value={editDraft.supplier}
              onChange={(e) =>
                setEditDraft({ ...editDraft, supplier: e.currentTarget.value })
              }
              radius={4}
            />
            <Textarea
              label="Ghi chú"
              value={editDraft.note}
              onChange={(e) =>
                setEditDraft({ ...editDraft, note: e.currentTarget.value })
              }
              radius={4}
              minRows={3}
            />
            <Group justify="flex-end" mt="xs">
              <Button
                variant="default"
                onClick={() => setOpenedEdit(false)}
                radius={4}
              >
                Huỷ
              </Button>
              <Button onClick={handleSaveEdit} radius={4} color="green">
                Lưu thay đổi
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* --- MODAL CONFIRM DELETE --- */}
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
            <Text span fw={700} c="red">
              {selectedSupply?.name}
            </Text>
            ?
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setOpenedConfirm(false)}
              radius={4}
            >
              Huỷ
            </Button>
            <Button color="red" radius={4} onClick={handleDelete}>
              Xoá ngay
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SupplyManagementPage;
