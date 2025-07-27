import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type Address = {
  fullName: string; // Tên người nhận
  address: string; // Địa chỉ chi tiết
  postcode: string; // Mã bưu chính
  phoneNumber: string; // Số điện thoại
  status: string; // Trạng thái (e.g., Default Shipping Address, Express Delivery Ready)
};
const addresses: Address[] = [
  {
    fullName: "Trung",
    address: "PJICO TOWER, 186 Điện Biên Phủ, Hồ Chí Minh, Quận 3, Phường 6",
    postcode: "Hồ Chí Minh - Quận 3 - Phường 6",
    phoneNumber: "0919090084",
    status:
      "Default Shipping Address, Default Billing Address, EXPRESS DELIVERY READY",
  },
  {
    fullName: "Anh Tuấn",
    address: "Chung cư MT Eastmark city Block D 18.06",
    postcode: "Hồ Chí Minh - Thành Phố Thủ Đức - Phường Long Trường",
    phoneNumber: "0766713492",
    status: "EXPRESS DELIVERY READY",
  },
  {
    fullName: "Giang Trung",
    address: "MT Eastmark City D 12.04",
    postcode: "Hồ Chí Minh - Thành Phố Thủ Đức - Phường Long Trường",
    phoneNumber: "0919090084",
    status: "EXPRESS DELIVERY READY",
  },
  {
    fullName: "Ngân Phạm",
    address: "Đặng Thùy Trâm 69/33",
    postcode: "Hồ Chí Minh - Quận Bình Thạnh - Phường 13",
    phoneNumber: "0947311234",
    status: "EXPRESS DELIVERY READY",
  },
  {
    fullName: "Ngân",
    address: "Nguyễn Tất Thành 247",
    postcode: "Đắk Nông - Huyện Cư Jút - Thị trấn Ea T'ling",
    phoneNumber: "0947311234",
    status: "EXPRESS DELIVERY READY",
  },
];

const OrderManagementAddressPage = () => {
  const navigate = useNavigate();
  const onAddPesticide = () => {
    navigate(PATH.PESTICIDE_ADD_MAIN);
  };

  const addressColumns: MRT_ColumnDef<Address>[] = [
    { accessorKey: "fullName", header: "Tên người nhận" },
    { accessorKey: "address", header: "Địa chỉ" },
    { accessorKey: "postcode", header: "Mã bưu chính" },
    { accessorKey: "phoneNumber", header: "Số điện thoại" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => (
        <Text fw={500} c="green">
          {cell.getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Button variant="outline" radius={4} color="blue">
          EDIT
        </Button>
      ),
    },
  ];
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý địa chỉ giao hàng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddPesticide}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={addressColumns} data={addresses} />
    </Stack>
  );
};
export default OrderManagementAddressPage;
