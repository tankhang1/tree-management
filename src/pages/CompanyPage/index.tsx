import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Title,
  Tooltip,
  Text,
  TextInput,
  SimpleGrid,
  MultiSelect,
  Modal,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
  IconRefresh,
  IconSearch,
  IconNotification,
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// IMPORT STORE VÀ TYPE MỚI
import NotificationModal from "./components/NotificationModal"; // Giữ nguyên component này
import { useCompanyStore, type Company } from "../zustand/companyStore";

const CompanyPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { companies, deleteCompany } = useCompanyStore();

  // 2. STATE LOCAL
  const [rows, setRows] = useState<Company[]>(companies);

  // Filter States
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Lọc theo type (Doanh nghiệp, Nông hộ...)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Lọc theo categoryType (customer, partner...)

  // Action States
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Modals
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [openedNoti, { open: openNoti, close: closeNoti }] =
    useDisclosure(false);

  // Sync Store -> Rows khi data thay đổi
  useEffect(() => {
    setRows(companies);
  }, [companies]);

  // Navigation
  const onAddCompany = () => navigate(PATH.COMPANY_ADD);
  const onCompanyDetail = (id: string) =>
    navigate(`${PATH.COMPANY_DETAIL}/${id}`);
  const onCompanyEdit = (id: string) => "";

  // --- LOGIC FILTER MỚI ---
  const resetFilters = () => {
    setKeyword("");
    setSelectedTypes([]);
    setSelectedCategories([]);
    setRows(companies);
  };

  const applyFilters = () => {
    const kw = keyword.trim().toLowerCase();

    const filtered = companies.filter((item) => {
      // 1. Tìm kiếm theo từ khóa (Mã, Tên, Người đại diện, SĐT)
      const okKw =
        !kw ||
        item.name.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw) ||
        item.representative.toLowerCase().includes(kw) ||
        item.phone.includes(kw) ||
        item.email.toLowerCase().includes(kw);

      // 2. Lọc theo Loại hình (Doanh nghiệp/Nông hộ...)
      const okType = !selectedTypes.length || selectedTypes.includes(item.type);

      // 3. Lọc theo Phân loại (Khách hàng/Đối tác...)
      const okCategory =
        !selectedCategories.length ||
        selectedCategories.includes(item.categoryType);

      return okKw && okType && okCategory;
    });

    setRows(filtered);
    notifications.show({
      message: `Tìm thấy ${filtered.length} kết quả`,
      color: "blue",
    });
  };

  // --- LOGIC DELETE ---
  const confirmDelete = (company: Company) => {
    setSelectedCompany(company);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedCompany) {
      deleteCompany(selectedCompany.id);
      notifications.show({
        title: "Thành công",
        message: `Đã xóa ${selectedCompany.name}`,
        color: "green",
      });
      closeDelete();
      setSelectedCompany(null);
    }
  };

  // --- LOGIC NOTIFICATION ---
  const handleOpenNoti = (company: Company) => {
    setSelectedCompany(company);
    openNoti();
  };

  const handleSendNotification = (message: string) => {
    console.log(`Sending to ${selectedCompany?.email}: ${message}`);
    notifications.show({
      title: "Đã gửi",
      message: `Đã gửi thông báo đến ${selectedCompany?.name}`,
      color: "teal",
      icon: <IconNotification size={16} />,
    });
    closeNoti();
  };

  // --- CẤU HÌNH CỘT (TABLE COLUMNS) THEO TYPE "COMPANY" ---
  const columns: MRT_ColumnDef<Company>[] = [
    {
      accessorKey: "code",
      header: "Mã định danh",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên đơn vị",
      size: 200,
      Cell: ({ row }) => (
        <Stack gap={0}>
          <Text fw={500} size="sm">
            {row.original.name}
          </Text>
          <Text c="dimmed" size="xs">
            {row.original.brand}
          </Text>
        </Stack>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại hình",
      Cell: ({ cell }) => (
        <Badge variant="outline" color="blue">
          {cell.getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: "categoryType",
      header: "Phân loại",
      Cell: ({ cell }) => {
        const val = cell.getValue<string>();
        let color = "gray";
        let label = "Khác";
        switch (val) {
          case "customer":
            color = "green";
            label = "Khách hàng";
            break;
          case "partner":
            color = "violet";
            label = "Đối tác";
            break;
          case "supplier":
            color = "orange";
            label = "Nhà cung cấp";
            break;
          case "bank":
            color = "blue";
            label = "Ngân hàng";
            break;
        }
        return <Badge color={color}>{label}</Badge>;
      },
    },
    { accessorKey: "representative", header: "Người đại diện" },
    { accessorKey: "phone", header: "SĐT" },
    { accessorKey: "address", header: "Địa chỉ", size: 200 },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => onCompanyDetail(row.original.id)}
              leftSection={<IconEye size={18} color="gray" />}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              onClick={() => handleOpenNoti(row.original)}
              leftSection={<IconNotification size={18} color="orange" />}
            >
              Gửi thông báo
            </Menu.Item>
            <Menu.Item
              onClick={() => onCompanyEdit(row.original.id)}
              leftSection={<IconEdit size={18} color="blue" />}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              onClick={() => confirmDelete(row.original)}
              leftSection={<IconTrash size={18} />}
              color="red"
            >
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
          Quản lý doanh nghiệp / nông hộ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddCompany}
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
            <Title order={4}>Tìm kiếm</Title>
            <Text c="dimmed" size="sm">
              Lọc theo tên, mã, loại hình hoặc vai trò
            </Text>
          </Stack>
          <Group>
            <Tooltip label="Xoá bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={resetFilters}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button
              radius={4}
              leftSection={<IconSearch size={16} />}
              onClick={applyFilters}
            >
              Tìm kiếm
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Từ khoá"
            placeholder="Nhập mã, tên công ty, người đại diện, SĐT..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Loại hình"
              placeholder="Chọn loại hình"
              data={["Doanh nghiệp", "Nông hộ", "Hợp tác xã"]}
              value={selectedTypes}
              onChange={setSelectedTypes}
              clearable
            />
            <MultiSelect
              radius={4}
              label="Phân loại"
              placeholder="Chọn vai trò"
              data={[
                { value: "customer", label: "Khách hàng" },
                { value: "partner", label: "Đối tác" },
                { value: "supplier", label: "Nhà cung cấp" },
                { value: "bank", label: "Ngân hàng" },
              ]}
              value={selectedCategories}
              onChange={setSelectedCategories}
              clearable
            />
            {/* Bạn có thể thêm lọc theo Tỉnh/Thành nếu muốn phân tích chuỗi Address */}
          </SimpleGrid>
        </Stack>
      </Card>

      {/* TABLE */}
      <Table columns={columns} data={rows} />

      {/* DELETE MODAL */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xoá"
        centered
      >
        <Text>
          Bạn có chắc chắn muốn xoá đơn vị{" "}
          <strong>{selectedCompany?.name}</strong>?
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          Hành động này sẽ xóa vĩnh viễn dữ liệu bao gồm chi nhánh và liên hệ đi
          kèm.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xoá ngay
          </Button>
        </Group>
      </Modal>

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        opened={openedNoti}
        onClose={closeNoti}
        receiverName={selectedCompany?.name || ""}
        onSend={handleSendNotification}
      />
    </Stack>
  );
};

export default CompanyPage;
