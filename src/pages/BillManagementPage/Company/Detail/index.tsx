import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPhone } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
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
const BillManagementCompanyDetailPage = () => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Group gap="lg" align="flex-start">
      <Stack flex={1}>
        {/* Thông tin đơn hàng */}
        <Card withBorder radius={4} shadow="sm">
          <Stack gap="xs">
            <Group mb={"md"}>
              <Button
                variant="subtle"
                radius={4}
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Title order={4}>Chi tiết đơn hàng (#515582734723982)</Title>
            </Group>
            <Group justify="space-between" align="center">
              <Group align="center" gap="xs">
                <Image
                  src="https://www.colgatepalmolive.com.vn/content/dam/cp-sites/corporate/corporate-2021/our/brands/colgate.png"
                  alt="Colgate"
                  w={30}
                  h={30}
                />
                <Text fw={500}>Colgate - Palmolive</Text>
              </Group>
              <Button variant="outline" radius={4}>
                Nhắn tin cho người bán
              </Button>
            </Group>
            <Divider />
            <Card withBorder radius={4} shadow="sm" p="md">
              <Group align="center" gap="md" justify="space-between">
                <Group>
                  <Image
                    src="https://play-lh.googleusercontent.com/R6Kzs8sI4-yEqn-o1TVl70l7Adv3M3OHdvT5ZI1knjAfih7zM50XU3UZX0UJy1G2DnM"
                    alt="Standard Delivery"
                    w={40}
                    h={40}
                  />
                  <Stack gap={4}>
                    <Text fw={500}>Nhận hàng trong khoảng 27/5 - 29/5</Text>
                    <Text fw={500} c="green">
                      Standard Delivery
                    </Text>
                  </Stack>
                </Group>
                <Text fw={500} c="green">
                  180,000 VNĐ
                </Text>
              </Group>
            </Card>
            <Divider />
            {cartItems.map((item) => (
              <Group key={item.id} align="flex-start" justify="space-between">
                <Group align="center" gap="xs">
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
                      Giá: {item.price.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm" c="dimmed">
                      Số lượng: {item.quantity}
                    </Text>
                  </Stack>
                </Group>
                <Button variant="transparent" radius={4}>
                  Cancel
                </Button>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* Thông tin giao hàng */}
        <Card withBorder radius={4} shadow="sm" p="md">
          <Stack gap="xs">
            <Title order={4} fw={700}>
              Thông tin giao hàng
            </Title>
            <Divider />
            <Group align="center" gap="xs">
              <Text fw={500} size="lg">
                Trung
              </Text>
              <Badge color="blue" variant="filled">
                WORK
              </Badge>
            </Group>
            <Text fw={400} size="sm" c="dimmed">
              PJICO TOWER, 186 Điện Biên Phủ, Hồ Chí Minh, Quận 3, Phường 6
            </Text>
            <Group align="center" gap="xs">
              <IconPhone size={16} color="green" />
              <Text fw={500} size="sm">
                0919090084
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>

      <Stack flex={1}>
        {/* Thông tin thanh toán */}
        <Card withBorder radius={4} shadow="sm">
          <Stack gap="xs">
            <Title order={4}>Thông tin thanh toán</Title>
            <Divider />

            <Group justify="space-between">
              <Text fw={500}>Mã đơn hàng:</Text>
              <Text>#515582734723982</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Ngày đặt:</Text>
              <Text>26/07/2025 10:18:06</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Ngày thanh toán:</Text>
              <Text>26/07/2025 10:18:11</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Tên doanh nghiệp:</Text>
              <Text>Colgate - Palmolive</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Mã số thuế:</Text>
              <Text>123456789</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Thanh toán bằng:</Text>
              <Group>
                <Text>MoMo E-Wallet</Text>
                <Image
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s"
                  }
                  w={20}
                  h={20}
                />
              </Group>
            </Group>
          </Stack>
        </Card>

        {/* Tổng kết đơn hàng */}
        <Card withBorder radius={4} shadow="sm">
          <Stack gap="xs">
            <Title order={4}>Nội dung thanh toán</Title>
            <Divider />

            <Group justify="space-between">
              <Text fw={500}>Tổng phụ (2 sản phẩm):</Text>
              <Text>{totalPrice.toLocaleString()} VNĐ</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Phí vận chuyển:</Text>
              <Text>20,100 VNĐ</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Khuyến mãi phí vận chuyển:</Text>
              <Text>-20,100 VNĐ</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Tổng cộng (đã bao gồm VAT):</Text>
              <Text fw={700} c="green">
                {totalPrice.toLocaleString()} VNĐ
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Thanh toán bằng:</Text>
              <Group>
                <Text>MoMo E-Wallet</Text>
                <Image
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s"
                  }
                  w={20}
                  h={20}
                />
              </Group>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Group>
  );
};
export default BillManagementCompanyDetailPage;
