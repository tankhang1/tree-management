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
  Stepper,
  TextInput,
} from "@mantine/core";
import {
  IconCircleCheckFilled,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
const creditCards = [
  {
    id: "card1",
    type: "Visa",
    logo: "data:image/png;base64,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",
    cardNumber: "**** **** **** 9586",
  },
  {
    id: "card2",
    type: "MasterCard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    cardNumber: "**** **** **** 1234",
  },
  {
    id: "card3",
    type: "MoMo E-Wallet",
    logo: "data:image/png;base64,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",
    cardNumber: "**** **** **** 0084",
  },
];
const OrderManagementQuickPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState("standard");

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
      <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
        <Stepper.Step label="Giỏ hàng" description="Xem và quản lý giỏ hàng">
          <Group align="flex-start">
            <Stack gap={"xs"} w={"60%"}>
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
                    <Group
                      key={item.id}
                      align="flex-start"
                      justify="space-between"
                    >
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
                    <Group
                      key={item.id}
                      align="flex-start"
                      justify="space-between"
                    >
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
            <Stack flex={1}>
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

                  <Button radius={4} fullWidth onClick={() => setActiveStep(1)}>
                    Thanh toán đơn hàng
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Group>
        </Stepper.Step>
        <Stepper.Step
          label="Xác nhận đơn hàng"
          description="Xem và xác nhận đơn hàng"
        >
          <Group grow align="flex-start">
            {/* Thông tin giao hàng */}
            <Stack gap="xs" w="60%">
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

              {/* Phương thức thanh toán */}
              <Card withBorder radius={4} shadow="sm">
                <Stack gap="xs">
                  <Title order={4}>Phương thức thanh toán</Title>
                  {creditCards.map((card, index) => (
                    <Group
                      key={card.id}
                      align="center"
                      gap="xs"
                      justify="space-between"
                    >
                      <Group>
                        <Image src={card.logo} alt={card.type} w={50} h={50} />
                        <Stack gap={"xs"}>
                          <Text fw={500}>{card.type}</Text>
                          <Text size="sm" c="dimmed">
                            {card.cardNumber}
                          </Text>
                        </Stack>
                      </Group>
                      {index === 0 && <IconCircleCheckFilled color="green" />}
                    </Group>
                  ))}
                </Stack>
              </Card>
              {/* Voucher Option */}
            </Stack>

            {/* Tổng kết đơn hàng */}
            <Stack gap="xs" w="40%">
              <Card withBorder radius={4} shadow="sm">
                <Stack gap="xs">
                  <Title order={4}>Voucher</Title>
                  <Group gap="xs">
                    <TextInput
                      placeholder="Nhập mã voucher"
                      radius={4}
                      w="70%"
                      flex={1}
                    />
                    <Button radius={4}>Áp dụng</Button>
                  </Group>
                  <Stack gap="xs">
                    <Title order={4}>Phương thức giao hàng</Title>
                    <Group wrap="nowrap" gap="xs">
                      <Card
                        withBorder
                        radius={4}
                        shadow="sm"
                        p="md"
                        style={{
                          borderColor:
                            selectedDeliveryOption === "standard"
                              ? "green"
                              : "",
                        }}
                        onClick={() => setSelectedDeliveryOption("standard")}
                      >
                        <Stack gap="xs">
                          <Text fw={500}>Miễn phí - Giao tiêu chuẩn</Text>
                          <Text size="sm" c="dimmed">
                            Giao hàng trong vòng 3-5 ngày làm việc.
                          </Text>
                        </Stack>
                      </Card>
                      <Card
                        withBorder
                        radius={4}
                        shadow="sm"
                        p="md"
                        style={{
                          borderColor:
                            selectedDeliveryOption === "express" ? "green" : "",
                        }}
                        onClick={() => setSelectedDeliveryOption("express")}
                      >
                        <Stack gap="xs">
                          <Text fw={500}>
                            Nhanh - Giao trong ngày (+20,000 VNĐ)
                          </Text>
                          <Text size="sm" c="dimmed">
                            Giao hàng trong vòng 24 giờ.
                          </Text>
                        </Stack>
                      </Card>
                    </Group>
                  </Stack>
                  <Title order={4}>Tổng kết đơn hàng</Title>
                  {cartItems.map((item) => (
                    <Group
                      key={item.id}
                      align="flex-start"
                      justify="space-between"
                    >
                      <Group>
                        <Image
                          src={item.img}
                          alt={item.name}
                          w={80}
                          h={80}
                          fit="cover"
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
                    </Group>
                  ))}
                  <Divider />
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
                      <b>Phiếu giảm giá:</b>
                    </Text>
                    <Text c={"dimmed"}>Không có</Text>
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
                    Xác nhận đơn hàng
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Group>
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
};

export default OrderManagementQuickPage;
