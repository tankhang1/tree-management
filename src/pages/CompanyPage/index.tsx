import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import {
  IconBuilding,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconMap,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
type FarmerEntity = {
  id: string;
  name: string;
  type: "hộ nông dân" | "doanh nghiệp" | "hợp tác xã";
  ownerName: string;
  identityNumber: string;
  phone: string;
  email?: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  taxCode?: string;
  landCertificateNo?: string;
  note?: string;
};

const farmerDataset: FarmerEntity[] = [
  {
    id: "F001",
    name: "Hộ ông Nguyễn Văn A",
    type: "hộ nông dân",
    ownerName: "Nguyễn Văn A",
    identityNumber: "012345678901",
    phone: "0912345678",
    email: "a.nongdan@example.com",
    address: "Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
    location: { lat: 11.850812, lng: 106.674836 },
    taxCode: "",
    landCertificateNo: "CN123456789",
    note: "Canh tác theo mô hình VietGAP",
  },
  {
    id: "F002",
    name: "HTX Nông nghiệp Bền Vững",
    type: "hợp tác xã",
    ownerName: "Trần Thị B",
    identityNumber: "123456789012",
    phone: "0938123456",
    email: "info@benvungcoop.vn",
    address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
    location: { lat: 11.667091, lng: 106.985761 },
    taxCode: "0401234567",
    landCertificateNo: "HTX-987654321",
    note: "Liên kết tiêu thụ sản phẩm với doanh nghiệp Nhật",
  },
];

const CompanyPage = () => {
  const navigate = useNavigate();

  const onAddCompany = () => {
    navigate(PATH.COMPANY_ADD);
  };
  const onCompanyDetail = () => {
    navigate(PATH.COMPANY_DETAIL);
  };
  const farmerColumns: MRT_ColumnDef<FarmerEntity>[] = [
    { accessorKey: "name", header: "Tên đơn vị" },
    { accessorKey: "type", header: "Loại hình" },
    { accessorKey: "ownerName", header: "Chủ sở hữu" },
    { accessorKey: "identityNumber", header: "CCCD/CMND" },
    { accessorKey: "phone", header: "Số điện thoại" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Địa chỉ" },
    { accessorKey: "taxCode", header: "Mã số thuế" },
    { accessorKey: "landCertificateNo", header: "Số sổ đỏ" },
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
              onClick={onCompanyDetail}
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
          Quản lý doanh nghiệp / nông hộ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddCompany}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Button
          leftSection={<IconBuilding size={18} />}
          variant="filled"
          radius={4}
        >
          Doanh nghiệp
        </Button>
        <Button
          leftSection={<IconHome size={18} />}
          variant="outline"
          radius={4}
        >
          Nông hộ
        </Button>
        <Button
          leftSection={<IconMap size={18} />}
          variant="outline"
          radius={4}
        >
          Hợp tác xã
        </Button>
      </Group>
      <Table columns={farmerColumns} data={farmerDataset} />
    </Stack>
  );
};
export default CompanyPage;
