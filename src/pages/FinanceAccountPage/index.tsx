import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";

const FinanceAccountPage = () => {
  return (
    <Stack>
      <Title order={3} mb="md">
        Tài chính & Kế toán
      </Title>
      <Grid gutter="lg">
        {[
          {
            label: "Tổng thu nhập tháng này",
            value: "3.25 tỷ ₫",
            color: "green.6",
            description: "Tổng thu từ bán hàng và các nguồn thu phụ trợ.",
            icon: "💸",
          },
          {
            label: "Tổng chi tiêu tháng này",
            value: "1.92 tỷ ₫",
            color: "red.6",
            description: "Bao gồm chi mua hàng, vận hành, bảo trì và nhân sự.",
            icon: "📉",
          },
          {
            label: "Lợi nhuận ròng (ước tính)",
            value: "1.33 tỷ ₫",
            color: "blue.6",
            description: "Chênh lệch giữa thu và chi sau các điều chỉnh.",
            icon: "📈",
          },
          {
            label: "Công nợ phải thu",
            value: "620 triệu ₫",
            color: "orange.6",
            description: "Số tiền khách hàng chưa thanh toán.",
            icon: "🧾",
          },
          {
            label: "Công nợ phải trả",
            value: "310 triệu ₫",
            color: "grape.6",
            description: "Số tiền cần thanh toán cho nhà cung cấp.",
            icon: "💳",
          },
          {
            label: "Số giao dịch kế toán trong tháng",
            value: "154",
            color: "cyan.6",
            description:
              "Bao gồm phiếu thu, phiếu chi, hoàn ứng và quyết toán.",
            icon: "🧮",
          },
          {
            label: "Chi phí lương nhân viên",
            value: "450 triệu ₫",
            color: "pink.6",
            description: "Chi phí trả lương cho toàn bộ nhân viên tháng này.",
            icon: "👩‍🌾",
          },
          {
            label: "Tài khoản ngân hàng chính",
            value: "1.07 tỷ ₫",
            color: "teal.6",
            description: "Số dư tài khoản chính phục vụ chi phí vận hành.",
            icon: "🏦",
          },
          {
            label: "Số đợt quyết toán đã hoàn tất",
            value: "3",
            color: "indigo.6",
            description: "Bao gồm quyết toán quý và quyết toán nội bộ.",
            icon: "📂",
          },
        ].map((item, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="md"
              radius="md"
              p="lg"
              style={{
                transition: "transform 0.2s ease",
              }}
            >
              <Stack gap={6}>
                <Group justify="space-between">
                  <Group gap={6}>
                    <Text size="lg">{item.icon}</Text>
                    <Text fw={600} size="sm" c="gray.7">
                      {item.label}
                    </Text>
                  </Group>
                  <Title order={2} c={item.color} fw={700}>
                    {item.value}
                  </Title>
                </Group>
                <Text size="xs" c="gray.6">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
export default FinanceAccountPage;
