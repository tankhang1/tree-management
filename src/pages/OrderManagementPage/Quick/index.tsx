import {
  Button,
  Group,
  Stack,
  Title,
  Text,
  Image,
  Divider,
  Card,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

const OrderManagementQuickPage = () => {
  const cartItems = [
    {
      id: "SP001",
      name: "Mứt sầu riêng Ri6",
      img: "https://mutngon.com/upload/images/sau-rieng-monthong-nguyen-mui-say-thang-hoa-gion-don-mut-ngon-nafarm.jpg",
      quantity: 2,
      price: 150000,
      description: "Mứt sầu riêng Ri6 thơm ngon, đóng gói 250g.",
    },
    {
      id: "SP002",
      name: "Cafe hạt nguyên chất",
      img: "https://caphenguyenchat.net/wp-content/uploads/2021/06/ca-phe-nguyen-chat-co-tac-dung-gi-01.jpg",
      quantity: 1,
      price: 120000,
      description: "Cafe Arabica nguyên chất, rang mộc, đóng gói 500g.",
    },
  ];

  const shippingInfo = {
    fullName: "Nguyễn Văn A",
    phoneNumber: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
    note: "Giao hàng trong giờ hành chính.",
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Stack gap="lg">
      <Title order={2}>Quản lý giỏ hàng nhanh</Title>
      <Group grow align="flex-start">
        <Stack gap={"xs"}>
          <Card withBorder radius={4} shadow="sm">
            <Group justify="space-between">
              <Group>
                <Checkbox radius={4} />
                <Text fw={"500"}>Chọn tất cả ({cartItems.length})</Text>
              </Group>
              <Button
                variant="outline"
                radius={4}
                leftSection={<IconTrash size={16} />}
              >
                Xóa đã chọn
              </Button>
            </Group>
          </Card>
          {/* Giỏ hàng */}
          <Card withBorder radius={4} shadow="sm">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group>
                  <Checkbox radius={4} />
                  <Image
                    src={
                      "https://img.lazcdn.com/g/tps/images/ims-web/TB1T7K2d8Cw3KVjSZFuXXcAOpXa.png"
                    }
                    w={30}
                  />
                  <Title order={5}>
                    Lazada Global ({cartItems.length} sản phẩm)
                  </Title>
                </Group>
                <Text fw={500} c="dimmed">
                  Tổng tiền: {totalPrice.toLocaleString()} VNĐ
                </Text>
              </Group>
              {cartItems.map((item) => (
                <Group key={item.id} align="flex-start" justify="space-between">
                  <Group>
                    <Image
                      src={item.img}
                      alt={item.name}
                      w={80}
                      h={80}
                      radius="md"
                    />
                    <Stack gap="xs">
                      <Text fw={500}>{item.name}</Text>
                      <Text size="sm" c="dimmed">
                        {item.description}
                      </Text>
                      <Text>Giá: {item.price.toLocaleString()} VNĐ</Text>
                    </Stack>
                  </Group>
                  <Button variant="outline" radius={4}>
                    Xóa
                  </Button>
                </Group>
              ))}
            </Stack>
          </Card>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group>
                  <Checkbox radius={4} />
                  <Image
                    src={
                      "https://img.lazcdn.com/g/tps/images/ims-web/TB1T7K2d8Cw3KVjSZFuXXcAOpXa.png"
                    }
                    w={30}
                  />
                  <Title order={5}>
                    Lazada Global ({cartItems.length} sản phẩm)
                  </Title>
                </Group>
                <Text fw={500} c="dimmed">
                  Tổng tiền: {totalPrice.toLocaleString()} VNĐ
                </Text>
              </Group>
              <Divider />
              {cartItems.map((item) => (
                <Group key={item.id} align="flex-start" justify="space-between">
                  <Group>
                    <Image
                      src={item.img}
                      alt={item.name}
                      w={80}
                      h={80}
                      radius="md"
                    />
                    <Stack gap="xs">
                      <Text fw={500}>{item.name}</Text>
                      <Text size="sm" c="dimmed">
                        {item.description}
                      </Text>
                      <Text>Giá: {item.price.toLocaleString()} VNĐ</Text>
                    </Stack>
                  </Group>
                  <Stack>
                    <Button variant="outline" radius={4}>
                      Xóa
                    </Button>
                    <Group gap={4}>
                      <ActionIcon color={"gray"} radius={4} disabled>
                        <IconMinus size={16} />
                      </ActionIcon>
                      <Stack
                        justify="center"
                        align="center"
                        bg={"gray.3"}
                        w={30}
                        h={30}
                        style={{ borderRadius: 4 }}
                      >
                        <Text>{item.quantity}</Text>
                      </Stack>
                      <ActionIcon color={"gray"} radius={4}>
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Group>
                  </Stack>
                </Group>
              ))}
            </Stack>
          </Card>
        </Stack>
        {/* Thông tin giao hàng */}
        <Stack>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap="xs">
              <Title order={4}>Thông tin giao hàng</Title>
              <Group justify="space-between">
                <Text>
                  <b>Họ tên:</b>
                </Text>
                <Text>{shippingInfo.fullName}</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Số điện thoại:</b>
                </Text>
                <Text>{shippingInfo.phoneNumber}</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Địa chỉ:</b>
                </Text>
                <Text>{shippingInfo.address}</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Ghi chú:</b>
                </Text>
                <Text>{shippingInfo.note}</Text>
              </Group>
            </Stack>
          </Card>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap={"xs"}>
              <Title order={4}>Tổng kết đơn hàng</Title>
              <Group justify="space-between">
                <Text>
                  <b>Số sản phẩm:</b>
                </Text>
                <Text>{cartItems.length} sản phẩm</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Tổng tiền:</b>
                </Text>
                <Text c={"green"}>{totalPrice.toLocaleString()} VNĐ</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Phí vận chuyển:</b>
                </Text>
                <Text c={"dimmed"}>Miễn phí</Text>
              </Group>
              <Group justify="space-between">
                <Text>
                  <b>Tổng thanh toán:</b>
                </Text>
                <Text fz={"h2"} c={"green"}>
                  {totalPrice.toLocaleString()} VNĐ
                </Text>
              </Group>

              <Button radius={4} fullWidth>
                Thanh toán đơn hàng
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Group>

      <Divider />
    </Stack>
  );
};

export default OrderManagementQuickPage;
