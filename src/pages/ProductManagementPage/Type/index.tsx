import {
  ActionIcon,
  Button,
  Group,
  Image,
  Input,
  Menu,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

type Type = {
  img: string;
  id: string;
  name: string; // Tên loại sản phẩm
  note: string;
};
export const types: Type[] = [
  {
    id: "T001",
    img: "https://sutech.vn/wp-content/uploads/2024/03/sau-dong-lanh-1.jpg",
    name: "Sầu riêng đông lạnh",
    note: "Sầu riêng đông lạnh là sản phẩm chế biến từ sầu riêng tươi, giữ nguyên hương vị và chất lượng.",
  },
  {
    id: "T002",
    img: "https://khudulichdami.vn/Uploads/images/SanPham/SauRieng/qua-sau-rieng.jpg",
    name: "Sầu riêng tươi",
    note: "Sầu riêng tươi được thu hoạch trực tiếp từ vườn, đảm bảo độ tươi ngon và chất lượng.",
  },
  {
    id: "T003",
    img: "https://sauriengmart.vn/wp-content/uploads/2024/09/ri2-1.webp",
    name: "Sầu riêng khay",
    note: "Sầu riêng là loại cây ăn quả nhiệt đới.",
  },
  {
    id: "T004",
    img: "https://sauriengminhhoangkhoi.vn/wp-content/uploads/2022/04/nhung-thong-tin-ban-nen-biet-ve-sau-rieng-say-kho.png",
    name: "Sầu riêng sấy khô",
    note: "Sầu riêng sấy khô là sản phẩm tiện lợi, dễ bảo quản và mang đi.",
  },
  {
    id: "T005",
    img: "https://www.conngongvang.com/wp-content/uploads/2020/02/musang_king_tuoi_nguyen_trai.jpg",
    name: "Sầu riêng nguyên trái",
    note: "Sầu riêng nguyên trái được chọn lọc kỹ càng, đảm bảo chất lượng cao nhất.",
  },
];
const ProductManagementTypePage = () => {
  const [opened, setOpened] = useState(false);
  const typeColumns: MRT_ColumnDef<Type>[] = [
    { accessorKey: "id", header: "Mã loại" },
    {
      accessorKey: "img",
      header: "Hình ảnh",
      Cell: ({ row }) => (
        <Image
          src={row.original.img}
          alt={row.original.name}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { accessorKey: "name", header: "Tên loại sản phẩm" },
    { accessorKey: "note", header: "Ghi chú" },
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
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý loại sản phẩm
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={() => setOpened(true)}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={typeColumns} data={types} />
      <Modal
        title={<Text fw={500}>Tạo mới loại sản phẩm</Text>}
        opened={opened}
        onClose={() => setOpened(false)}
        radius={4}
      >
        <Stack gap={"xs"}>
          <Input.Wrapper label="Ảnh loại sản phẩm">
            <Dropzone
              onDrop={(files) => console.log("accepted files", files)}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    size={52}
                    color="var(--mantine-color-blue-6)"
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={52}
                    color="var(--mantine-color-red-6)"
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    size={52}
                    color="var(--mantine-color-dimmed)"
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Bỏ và thả ảnh loại sản phẩm tại đây
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm ảnh loại sản phẩm (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </Input.Wrapper>
          <TextInput
            label="Mã loại"
            placeholder="VD: DM001"
            radius={4}
            required
          />
          <TextInput
            label="Tên loại"
            placeholder="VD: Phân bón"
            radius={4}
            required
          />
          <Textarea
            label="Ghi chú"
            placeholder="Thông tin thêm về loại"
            radius={4}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" radius={4} onClick={() => setOpened(false)}>
            Hủy
          </Button>
          <Button radius={4}>Lưu</Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default ProductManagementTypePage;
