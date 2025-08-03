import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Title,
  Stepper,
  MultiSelect,
  Text,
  TextInput,
  SimpleGrid,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconMapPin,
  IconChristmasBall,
  IconArrowLeft,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { type ZoneCardProps } from "./components/ZoneCard";
import ZoneCard from "./components/ZoneCard";
import type { AreaCardProps } from "./components/AreaCard";
import AreaCard from "./components/AreaCard";
import type { LotCardProps } from "./components/LotCard";
import LotCard from "./components/LotCard";
import GrowthStageCard from "./components/GrowthStageCard";
import CropCards from "./components/CropCards";
import ConfirmStep from "./components/ConfirmStep";
import Scrollable from "../../../../components/Scrollable";
const zoneCards: ZoneCardProps[] = [
  {
    code: "VT-001",
    name: "Vùng Trồng Tây Nguyên",
    zone: "Tây Nguyên",
    organization: "HTX Cà phê Buôn Ma Thuột",
    manager: "Nguyễn Thị Hạnh",
    area: "50.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Thoai thoải"],
  },
  {
    code: "VT-002",
    name: "Vùng Trồng Miền Tây",
    zone: "Miền Tây",
    organization: "Hợp tác xã Nông nghiệp Cần Thơ",
    manager: "Trần Văn Bình",
    area: "65.000 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Ngập nước"],
  },
  {
    code: "VT-003",
    name: "Vùng Trồng Đông Nam Bộ",
    zone: "Đông Nam Bộ",
    organization: "Công ty CP Nông Sản Đồng Nai",
    manager: "Lê Văn Trường",
    area: "80.000 m²",
    soilType: "Đất thịt pha cát",
    terrain: ["Bằng phẳng"],
  },
];
const areaCards: AreaCardProps[] = [
  {
    code: "KV-TN1",
    name: "Khu vực Buôn Hồ",
    zone: "Vùng Trồng Tây Nguyên",
    organization: "HTX Cà phê Buôn Ma Thuột",
    manager: "Nguyễn Văn Tài",
    area: "15.000 m²",
    soilType: "Đất đỏ",
    terrain: ["Cao"],
  },
  {
    code: "KV-MT3",
    name: "Khu vực Thốt Nốt",
    zone: "Vùng Trồng Miền Tây",
    organization: "Hợp tác xã Nông nghiệp Cần Thơ",
    manager: "Phạm Thị Hoa",
    area: "20.000 m²",
    soilType: "Đất phù sa ngập mặn",
    terrain: ["Thấp", "Ngập"],
  },
  {
    code: "KV-DN2",
    name: "Khu vực Biên Hòa",
    zone: "Vùng Trồng Đông Nam Bộ",
    organization: "Công ty CP Nông Sản Đồng Nai",
    manager: "Hoàng Văn Đức",
    area: "18.000 m²",
    soilType: "Đất cát pha",
    terrain: ["Bằng phẳng", "Dốc nhẹ"],
  },
];
const lotCards: LotCardProps[] = [
  {
    code: "LO-A1-01",
    name: "Lô A1-01",
    areaCode: "KV-A1",
    zone: "Vùng Trồng A",
    treeType: "Sầu riêng Monthong",
    treeCount: 120,
    areaSize: "3.000 m²",
    status: "Đang canh tác",
    soilType: "Đất thịt",
  },
  {
    code: "LO-B2-02",
    name: "Lô B2-02",
    areaCode: "KV-B2",
    zone: "Vùng Trồng B",
    treeType: "Xoài cát Hòa Lộc",
    treeCount: 80,
    areaSize: "2.500 m²",
    status: "Tạm ngưng",
    soilType: "Đất phù sa",
  },
  {
    code: "LO-C1-03",
    name: "Lô C1-03",
    areaCode: "KV-C1",
    zone: "Vùng Trồng C",
    treeType: "Chôm chôm Java",
    treeCount: 100,
    areaSize: "2.800 m²",
    status: "Đang canh tác",
    soilType: "Đất cát",
  },
];
export interface CropOption {
  code: string;
  name: string;
  seed: string;
  harvestMethod: string;
  growthCycle: string;
  note?: string;
  image: string; // URL or base64
}
const cropOptions: CropOption[] = [
  {
    code: "TREE001",
    name: "Sầu riêng",
    seed: "Hạt lai F1",
    harvestMethod: "Thu hoạch thủ công",
    growthCycle: "Chu kỳ dài (5-7 năm)",
    note: "Yêu cầu đất thịt và thoát nước tốt",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    code: "TREE002",
    name: "Xoài",
    seed: "Ghép cành",
    harvestMethod: "Thu hoạch bằng sào",
    growthCycle: "Chu kỳ trung bình (3-5 năm)",
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBkYGBcYFxUXGBgYGBcYFxUXGBUYHSggGBolHRcXIjEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0lICYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALUBFwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EAD4QAAEDAgQDBgQFAwMCBwAAAAEAAhEDBAUSITFBUWEGEyJxgZEyobHBFCNC0fBSYuEHcrKCkhUkM6LC4vH/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAoEQACAgICAQMEAgMAAAAAAAAAAQIRAyESMUEEIlETMkJhFHEjgaH/2gAMAwEAAhEDEQA/AGL77v6gpM0byHJEYnVytyNENG/VL+zGHmlWdJkxuu+09XLTfG+y85N1YCpsq97XLj8LNv3UGKguqSf5C5JyMgbuRF7UGUTvCVJiiW7MArq9tw2i1xIl3BDXlTbzQt/UL410GyEY2wE9q6HInEbwSMu6GtiHua1u6f2/ZfNq4wU0nx7NQnt7HvBmcVwGupOkFWB3ZqoBLX6IE4TVnaYSrJEw3wbEm1BldoeRUeL2xDXBoELixw8EEuEOClo3AqA03aEaSspQnKn2jNCTBSGy4+ia1aRIDyl4tC0ubwBlOLm6aKWTjC056oHkrl0QXE8Al1jhbqzjG07o29YSDorJ2WsZogj1VPTqzSdie5wYUaRdM9Eu7uADxVyvqMgs+SR1rPhCo0vA0VYnFNwcC3jv1803pUSOHmp2WwY3vDwUNTEWOkcwuXM3zqvAZJWNKWwD2h7RqJOrT/a7cLWP/nsAa6HD+sH/AJNB+gVct3vDhDjE80fidUhuhPpoq4uVOmJElt//AE8tQZiNHBsmek6QfokV9b1M2fxZRo0PcHODeEkQDrw19UfgBhrgdpTC4pNqMLJEmfXTZc8MjxZXHw2NGWzeFXjq9JrKjsgBaHimcmak4gZmngWmZHKdtJlx7sf3Xjt/FT3yky4eRPxD5+a4wmzb+FpvbAdmcwkQdBqJ/qifYlOrZ9RkOd4qf6hvlP1y9VbI5X7Qyro88u6Tti0iOBB++yDNPlt/NVau2V5Tzd3S1O7yOE7N81W6bJVMcpcbkTaosVgyQ1xAPhA4fJDYu2Gxz0+/7KfC3EENgRA36cQPdRYjWzvH9LXaeh1K6V0EUFjqby1wjgQmFiT8LtRwPEdOqg7WXQq1C4aNiJ5qLB6+YRxH8lThbjZaOi5mj3tHM0ZXNkGNPNJmVsw0DRzngRvwnquLTFX0nOYASHiCTsTwPQpe1uRxa9+pE+s6BTjBxlfgVqh5bXfgIkEj5A+cfwrErsH+PKeMgyR5/YLFflQlHq+EXAILv1Qk/aCXNI5kJnTp5crhwGoQ2Oxlzt1G64IZVJf0OyqU7Vxe4kaNGiWXtQ7FPqVy6dgAUvx6gBBHFUhJtMRlfuLd1Q5W7xKTZXAkHgYXo3YF9FtSq6rGjYEqrYpTaLio8CGOcSNNNTorYtIxrD/ygHg6o6ljdR7xmdDBy4pHVeM2myc2tnmaCBKlnfAVsumH4lTcIBTO3oN1K8/t6hovDoVqssYbUHh0XLqXQ8XYWLcSY4pbXw7KXaanUJtbFEPpB2pUcuOvt70M+yuiwimXOO0pFbODszpl3LomPau5LRkB3SPCaAAc5xg8AuiMfaI+yW4t6zmFzW+E7nyTvsPckZmHzS64xs06PchskpHQxZ9J+Yeq6MTpqgFxxOXkuGhlBUX8DuibVxdTzc9UvruhyGWXF8hE6JsSuGmllIgqv21ETqj8VlzBHPVLacgpZvmrQ72ObbCi8tI0CjxJhYXMdvwR9O5c2mAwIjH7MVKbao1eBqOaf09qOw0V7DtNOZTP8ECQeo9dUM9wZSaQPEt2eKB5AIgzsuTNGXPkhGqkR0bt9vwzUs5bE65sskg84j2Kb08YzU8zCRJgjiNN9OCUXNImjUbHhzNeDyLczXDqYcBC67M1wx4LgCBuP7To77H0XVNlZfeL61pmccsyT76rPwvdmX6RsNzKbdpKtPvHtp7iDpprOyWF5eIn3/dUxwTWwUbsXaudPQErK1vOkaldWwygSd5PMcvsn2G2U6lwa8atHMKmTJGEbYEVu+sIohxkDnGiX4fDYgz6FWjtLXBpENgSYcP7uYQWC0Kfdgc95UsL5RG6OawZlaeO6UXlEucT5R1Ta6pU2GBUknZvFDFquOtohZUdla4g6j5jT7LFPeXebJSDdGt04EnSf50CxKpV2I0eoW1wCYnzVWvMVLa7mM8QOkLbrs0qbnzq7ZD9nLUZzUfqTtK8vDi43LywW3ohvcNrPMgkDeFmJ1D3YncaK1VYieCrWNWxLNNiumDe7M0K7JuSHEwDuicTc1wjbTRJxcmADwKbXkFrTzV5uo+1CiCpRhP+zOL924MdGUreHWzahLCPJKcQszSeWnhsljNZY8WY9Iu7Sk9oMAgpX/4Hlk0yQo+ymI94zI46tT51UbBcuRxh7fJR0C2VN5EHcItznNaZ4Lu0qQYK57Q3bWUiP1FaTppGlRQ8Suu8rdJUt3eAw1jRohm25zaakp/heEhol26aMXJ0TpsAssPdVcdOCWXlsBU7tjczuKuF3XFvRc+OCoFpme91Qk6md1f6fF0ZMtmGvIaKbgMwUOK0NA5BdnqoNfXcjSeafXrNw7YpMquIjK82DIOxQtvf0MxY6QdtpRNRuVxC3b2dPMahHi4/ukwTp0wwe6HFpWYWFrYkDSdJUNaq7JIBS2/vabevlwU9viLDRJzGOR3PRdVJFqFV1cnPl4KexthUewgfqE+Q1PyBSx7nVKhIbE7DgFbMHwStTYXaHQOeZ+Bk8OriD6N6pJY/gHFWcYXdtDKriPgqB56h5c0z8kuxWxNtVaY/LeMzDwLTuPMbe3NNrG1aKNd0aGm0kf7Xz9EB2ixIVMjR8LG6DqdyOXJSqKb+QS2arWodQ/ETDwWMd1IkZvUBqCLZ3MjoE0w22OQ0SWnOA5h6jaRwIS9tEgQYGXef5qq4W7aZn0c067G1JI8IgRzKxlOq+5DwfiMATw5JfWpmJ4gz7prgtCrUcHU26t4p5RjJ7AwPtFTdTc6m/wDVqCluFVdcpOq9CvMAqXbfzYa4bEKn3GGGhUNN4EzId9lRKlRlsgxKxLvG3carVu8lmYiDxH7Jhh92ypUyTtv16LWOWdRtYPDR3cRl4xz80ZNLsaLa0D9yHROhGoPpBWKUHhrPPosQpMpVjG9a57w2CGjbkmtoIgIm+bIbIC5tWQQTsuSKURKo6xS5y01DceOiHdEd2yfRNKmKfxHeOUfuh6VOaAbyCVyXOrEbtlYp4RmpvcN5K1VouNEQNQU4sKxALdgDqtXN4wRTaJcTw/miGPJONqfnoOhXhbHU3tLhAKztPd5qkR6p1f2ssg/EFWsRtKhgkT1TquVmaOcPr908HgrfSxUDUaqk1qJgKy4XTbDZ4rn9XjtrJHsVp+B7bYlJmFX8fuy5xTuta5RLf4EnvrFxaXASo4skuVTNvpkfZ1gLpO6tFaj4ZVWsAaQkp6MZYWQV048qbaQ8ZKqFHa6//L7sKvN8NIdUd2pqBzgW7JNiFYhjRzC6OTkxKoJsnAODgYIMqznEA8akZl5yx7iYEymbadQAZpngtPC15Fqyw3FOSoZhE4XZVHtGeZO3NTYnaMo0yXBxP0XP/HmgcRbfW1LuwZmf08Z6qBlIuZlyevABRMxGm9wblLTsJ4o4PcGyHw3jI2I4LpSn+RaDV7JsAw01K2XhxPIDc/QeZCcUMYqfiKlrEMhzXabtZTJbHsD6pl2ZoNFE1QZL4E9G8vUn2C4xGzH4vvQYzUXyOrRE+zmj0XB/Mb9RLF4r/vkzq7FWHV3up3TSZa2jDRyAO3sqyKZOo1VrsBlp1/7qZb/1H4R5yktOjAM7rpnpoy6shsbl3eU3GZY4GBtAO3smmMW8VXtiGzLDGsGTEbHkiMCwJ1yWtpbgAvcfhb1J56aDj7leg2/ZKg2m1lTNVLZhxLmxPINIgepVW4wdg3R5Ld2k5Wt+IxoOXMo22xapYnu3MBDtZXoA7I21Il1Jpa7q5zx/7yT81Re3zAwBj2HN+l3A84P2TQafuT2I+wmn2zMEMbrCrTHPu6pzzA19UpsmPc6G+RKuGH0GUKZgy6NSjOfi9jKvANgVNsOJaG+Ihr+o0g+ysLLAVQc/xN3Sbs7XY6i4O1BLiR6lbqXj2agkjg7pwaR91WaTjs3kW1mRVcwbDisR+FszuLhrK2pw6GUmh1VeHegUN1WgNC3WaY2Ql8zQFTSpIZ7RFXqZnNT6jVDR4tjoq1ZNl8nZNb+8Zk03GwXO8cfqKUuxBLidN5qlrDpuoMOovbVmJIU7WFus6ld/iy0GB5lBZLlvoVbOri9f3kbnjyR9ke8OU6lAznZpvxKYYdamm3ON10LFFv6k/BrpiTFgaD4cJnVTWteQ1wCH7TNeXgv47QpcNtS1o6owlz3HoLlRcMPvGuAaRqt3mJU6fgEE8Qq6bo0xpuhatI5HVXHVGco/bVm5t9ju9uKVU6NHsgb57KbSco2QOAXbCSH+i1iP59Xu2aNG5+yEWvCG8Fbu7kuPRZGdoB0gKyvwFrJJ2ASjD7Pvqpa2ABzVIqkmLYBb2+QyN1YcLoOf4n7DaU8t+zzRroeqJNnTb8Tvmmcn4J2cWmIMp8C4qK8vy6fyxrzEqO8xGjS03PQJc7FHVHBrWkZjA4kk7ABTb3TZkmD0MNq16rabKLHOO2UQdNyeAA5q9N/06pEA16r80CW0yGtnqSDPsFYuzOCNtKWutVwl7vowHkPmdUXUcXODR+ogfuVOU+Oh22B4J2WY1gZJ7lkhuvidqXGTyklWAWzKYhjGjyA+u6JBAAA2GgHRQVXyowxQxttLbbd/2ML76i14LXta5p4OAI020K897UdmxRBq0Zyfqbvk6g7lv08tvRLgoC6AILTBBEHqDunu+xLaM7IWbaVrTaNyA5x5udqfbb0TWuFV+zmIFuak46scW+g+E+og+qf1LgEKM3tjqWiCo5JcewtlxTNOoJadQeLTwcDwKa1HrlwkLY20xGeSnDxQqGk4QRseY4EIitQDco4GZ9k/7dWH5ffAeKnqf9n6vbf3VYoXwIk6gN0V4xVhizWB0BkeY0JMe67dUABA3R+E0x+GzAamT7paKDoLeJVZJrYWD2NzknLx31WLRwuqwyWFYhGLoHJly7kvbsoLiz0AO6IqYkG+Bgl25P8AS2JnzjYImmx5ax7h4SJn5FI7TsdSV0IDb5JMISlTkl5HkrDeNa8GEkvH5RC55blyYkmR9zmcAuMTbDm0gN1FRe4nQwtPzd8J4JIv5MhxQsMoARt74aYGyKt6YMeST9rKhblAXo54/wCGv0LexZWHev12ajqdHT5LjD7eGzxKbMt5LWDcpcCUMRn2I7u3BfE6BD9o3ZKTWDivR8L7MN7rxCSeK897cUcjwzgCoY37pNjNUCYTRb3cx4joE0o2Bt2ZzqSl+EUzDTwCmxrEi8tp9dVaCuRk6AcWxIkZNRzXGAWupcdkXa4TnzVDJjZQ0KgaCDpqqp3PZn0NO9PBxgdUJc1eJ2XVu6YEbqK7ZAIPVcvrJNyS8CC6tdCrU02Ct/8Apzh4q3OciW0Rm83nRn/yP/SFSLajlE8T9F6r/ppRDLR7+L6h9mgAfPN7oUuVh8lquKiFs6/57B5/8So7mqlffObUY8AkBwnKC4xx+HbSd4UuXuMXYuUFZy2XaIOvVVJMo2ac9AXb4XT6yXX91olXZJsqtW/NO+qNnRwY71ygH6BWi1v5A1XluOXTvxDqwBjN8gAPtKsuE4mHAEHdPkjZui7MrypmPSS1uJTOk+Qo9BTI8RphzSDqCCCOYOhXktnYuFR9HXwucP8AtML1u5doqVd5WV3uA1O/sF0Ymq2a6Yqw7EzQaWvGgJCsXZlrHuNZ3oq/WaCHZgIJlG0LsU2QNE8pD/sseM4iw6BoWKkXmJzxWKfJgseWtDLTlxl7tzPWSev+Cm1W7LaLGTs366/dAXVZoBcdmjby2E9fuq03Fa7jq8+zY14REKubSRN9lisfEXGdAld2ZcVzhWIuLnNMTG4AHnIGi7iTC5Mz0khl0EYXbEmVDeOHeuI6Ky2FBoZGxVcq28VHE809JRUSjVIsGE1dJKQ9qnkv8kxsLoBscklxWqXuJVs2S8aROhlhGrGhTm7y3bANY090Fgz8vxcE1wi2a6uKhQnO8SSGitl/N+G0hzheU9vvE7Mr3iTSR4VVe0mEvdSJI4KcUPJCnAyRSmOCWhpdUJI4p7gd2xlocw12S3D6eas3qV0YvLZMuWH4Z+VHRLLjs7TfT8BHeBzjm4O28J6cv8qzXZ7ukY5QPXT7pTakhvr9lFSqXYJvwVyzpBriTu36pXXrlzjPEpzjLSKhPBwB9dj9EjrOA091T1DTjYL0CvElek9kKv8A5ENBIOZ4kbgzM/MLzkBem/6U2jiyo94/La8FvV8a+wyn1ChAyTsteGYC0tD64zcQx2oHVw59Edd1A1uVoAA2AAAHkBspa9wkuIXOhSSlWkWekdU7oFvUSCldzebpLc4r3TnE6tdv0I2Krl52imQ1OlaIt2Wq4xEDikl1emoYHqq23FDU2Mz7J5hdNFtRBQNf4cC3ZV6jUNCpH6CfY/svQX0Jaqf2htI1TY3ejJjvDb0aSVYLW50Xldvi3dEA6t+Y8labLHmFoMyP5uhPGw0Wy5uBCpd9WzVHHr9NEReYzmENSkPRSpGRFiFSGzyKX1r4luhTTIHaHik+IWZpmRsqKNjpaAnXBKxSPpjLIWKio1MvF9bvqNDQQBIJJ4kHQQJj16KKngrQNST5CP3TP8O5jZP+UN+OJMBkDmT9gFm03ticX8ATcMDXZm5p5GP2RllYOzgOGUnUAxJA3Mcl1iF1lb4dDzW7DEco11PVQmoydIMUP6VvGgKXYzaAN6qSleFrcxkzy1jzQWJXktzbg8eCGk6Gk30IKlcsciqDM2qGfR73bddC7FIQ0hzuf6R5f1H5eaScQXW2HObpMho2k6D04n0XIxfu9KW/9Rjl+lu3qZ8kpfWc4nMST16fTZaaPofkD+yntE3L4Gbseud++f6ED5QuanaO4cMrqhI5FrTw6hQW1g+oPC0nUdBx4nRFMwQA/mPjQaN1O0cePp6rWltguXyAC+EEZG8/1DnwBjgpaN+1jw4MMjhOn0JVkrMoModx3QEHN3mY5s2xzaatjSErFrTB0Gby4+cLo4tLsZN/J1ddqq1UZcrWt6CT89Exw2i7KKlRzi4nQHgOGnPVC0LanBLW6zOvLgeqZir4BvufoFBOLld2ByFnaBnwHo4fQ/cqsP3Vkxx0tHn9QUhIa0nNorT90U0FLRpg0JPBe29mLXuLOjT/AFZQ53+5/id7THoF4zh7Q9r3H4fh917Zd1o2SVxjspHRzdV0lva/VSXdykl3cpYxsSUhZiTZlV68oNY17zpAP+E7uqvVVzH3943uxtoXemoHvr6BWiknsCA8F+EK34adlSMGcWPLHHfUH6hXCyqQkyR2wyLCDoq/2hpSE2ZWEJTj1aKbjyBPyTYkKedMcNZ58k5wtsUtOOqShp2VloW+WmFbK/aO0cMqaKI1FqqCNkLUJUYuzIZWlcTuiKwa8aqu2lYszO3hYMZcZBXQl8FVKlRJdUPFlBAHPgsUTWlwH92v7fzqsW2+jWehlzqhy7BFXNgGsWqNxScBlPi5EEH0nf0Wryo52nBc/Foydord9U1hSCjoFzeU4ejiNAhB1LYsArv4YEtqYmWGAMwdu3n/AJRZpS3dVvEnlkg6EyB5cf29U77sWS2EXlywFwpAgHf7gRs3fz8kK48ec/v9ygmVuPp/PmnFhYzq+QJ0A3PInkI9/mkknZLs6tLd1R0NE66nYAO5n12Tuzwymxuep4so5eHXgBuTrx57Ii0YA3WBG0fCP5pql2L35c7Lwbv1d/j90soqEbfZgurfZxA8I2gafTh0W7GiXExEDj57JSx86DU8uasFm5sCkASCZe4aE7Zo5aaDyXPjwucuT8BX7BLnQ5QQ7z1HsP3SYvc9zQTs4GNh4ddhpwReLAU3FrXSRuRp4uIHONvOUst7g94xvPN/wcuqKaUrKNUhyyoQAeX8+6Z06ksb1J09GpK138/nkibW4IGWevvE/RcON8ZEEzeLjwD/AHD6FV69lxVmo2/fVG0+cn2H+UmxCzdTe5h4cV2xcuNrqzoxpULH3BbQLBuXL2CjiYq0adUH42Nd7jUeh0XjN6yAnXZrHHMZ3J1AJLek6ke8n1Kae4mkX26rJDeXO5UBxpp3KEqVO8aS0EtG54Ty/wAJcbRKiKpVLzAKnZh+igwqiZk7kqx0KYhCc7YSk4nYRqNxxU+HYhIAOjvr1Cc4vb6FVGs0h0jhqqRVqgrZaG4iAhruv3pDOB38go7Wiyq0OA146n6I/D6LGv1ECFRQaRT6dbKditHLU0HFPyMtFpeYQWPVGmqMvA6+6CvKzqrtT4RsOiH3JIHYQ+4adlA6DxCAr1cugReC0c8l/NGOJo2jRoTIjdd4RhbHPOYiB9kQ6nQbOZzgZ4cvJDiowkim5xEHUiI4b+qs1SYdE9DDTWDnN0AMCP55LaZYRilOkzu+MklaUFyXQWw27tSCQ6QeQg/Mj6KBuKVKYh2rep8XofsVYsUcHFw5GJ47Diq1iNIDUnpI3/8Aqry2qZLro7q1A/xN1+RB5EcCiGTA1VddVcx2duh4l0+KdTIMkgpnQxMPbIGo+Ia6dRzb/D1hxVjKQ6a6Aqt2jHjaeh+qaULsuMCSToANSfIJyeyvet/MJB4NaBmHPMToPL6J0nY0uip4RZz4iJ00HDQ/EfbQdPd1eXTKLS58njA+Iz59eKdOs6NBol7QG6uJG4nUF2bQCI2GypmK39rUAYX1AQSZbmdJ1y6OHXh09NGO92TSLHa4k3JmBBGw2JjSDrsdZ05qvNqFx6lBZ8raeR2afDoDMgjKY3mDB8gmVs0lpcB4tAB/cdvofmpZY6VGkg3DqZc8NYJcePBo4+uqsoApg06ZmpHiPFoP0cflKFwi1FGmQDNRwlz+IJGkTpI5FV+yualCrJ1cCZzT4p3md56qkahHjE1VsPvbfLmBGsSOqSUj+cw/7vm0hWbFqzKjBUbsdCORPBV64GUh8ZspnfXQ/NTntUUjtcQkVFJSfqgqh5arLd5cYG/836Li4HMkXvsVYS7vCOYb7wfolnaa2b37i54aNBES4+QUN32qdSpso2stAABqkeJ3PKD8MmTz14IKrL2Z6he95IEkkjy812464KPwdOPTA69pbkGXVNOPhA+mygsLVpqDuAXQQHZvib100E+6YMwzOAHzHIae/L6q24VgwaGtyxr4WAanqf8AKpGJpTXSAaWH03NPeUWOgyHEAaRs4xrqurgtdSLWxAOgAAABAIgDgnmIYXVYWuLmZIfmYNwQPCWnjBCqz7sseaLmECBldu0w0Rrw2QyQa8A20yKxpwU0FWAlgqQdFvvxGp9FzcdkyS/cIJVTsq4NVwOx+yaYpe6RO+iXVsFqMiqCIOsEwfZdEPgeCCHPFvUBHwnf908qFrmgt2hV2tYvqNkngpOz18WnuX8NirR0VhLwR4xbNa0uhK2HwN8lbr22DgQdQVW3Wn5raQ2hFRSdmkqFltauqOMAlE4fQqNJaAQSdFb6YZRblYAEK2rLsyi8pLkKm4ATJcCT0I1Qta07ou328o1EwrILpK8brZmjUb6pfqtqmaPYoFAkTHqsUzmhraZBJcRJAEx5rS6FKkFp2WRlw5zHCSXEDfQkx9dPkon1xLSN3TI8hsfVQ29bQHnH0lNKuFd63Mww8ajkeh/dIk3Ggyj5RXr21BlzeG4Opb1A/UPmPmlGfK7MCZHHQe+/sm9059OoQ4FpBke0aH7oW4pteJaAHwNODpH6RsD048I2M7p7IsuPYbErYseYDawBzzxaT+g8GcxvtqdFu+7Ty406QhjdM58LBwkcyR/CvOm1XNOYEgif/wAI+yPrV+9IeYjYNA0b0jiepV7aK40pdm7i9puLjWfL2uIkkkaTBa0bKCzubJ7R3pc1/GM0TzEJhRsaUSabTxkidfVd0GMB+Bn/AGt/ZFNFFE1hD6GYCk4d4S4sBmHZSYGuxLfv0TkXo1yMM5pyyAdGy7flmXFu1s6NaPIBRXNqRUdVEzl0g7mRII4aa9YUJR91+DcVZut2kokfEZ8tkpvMWpxJcX+TXSPUhO6dYPAe0eF0xtpBgj0K5q0YW4pO6NKPyKaN7l5ZXDXcSOBiN0db0szZOoO3XrHL+cFL+Da8ePYazsfIef8ANkSTpoI4abaaCOS5s2StHO1QHXgCBCWWtYB5bOsGfWIjpqQm4t5EuMN+Z5wPv9UBdUcpmnoOI0JIHXfdCElKNMyCGnOdIERPIck8w/OW90z4ZDjtqY3J5JNg7c2rvC35nyH3XoWG4LU7k1A3u2ASJBDnaaGOXUrsw4qVI22K6lalaMzvILuHEk8mt+6O7DXzqveXdXRokMYOXnxcTxXn96ypXqhpJc8mP5yCuF3Rda21JkcdTxBI0+/snhKpWPxod3+IZy4+enIGTHzQFCk3ICY1GoKWWNYlpM8D9EjvLyqX5GnaBp5JPUz0mBMJxamaTiWeJh5bjoR90oNw9xJDT7I6nY1SRmPzRdYBvhlc8FJ7NRWX3NQHhHIiVlzcvqAF74gcBuicWZ3ZzcFBXrMezQaplKXkeLa0bt8TOWN4UIvKZOYgtPMIanQbtJ9FO62piBLvPRXjIKd9lgtsXpkQStDJmDhBS62tWDxNBfG4j7qK2snvl2bI3gBr6J9vRS7VB17dNMgHUIelW0I5JWK8PdGusarj8aAd5J3UvopdEEuxo+qhMRGZo6HX1WULphIlc13aHXdJwcdhSrs5fULWsdGkQsUdS5blDTwWK8Wq2h0yexqnIG/0/YkfZXrAH+BYsWh2bwb7QUKbqfjZm5awR1BXn7mceEHT1WLEcq6JyRFeeMOJ3bx/q1gZuZE7rnBH+PLwdw5EcVixLHpix+5FmbbiNEvrUYMgraxBnTMbYWJCmvm5Qz+54Hl4XmfksWJmvaBAQMOAHwkSG6Q3UkxHMyfVEF24WLFNB8I5uXEBoGkiT5yR9B8yisFtg8+LYRpzJMeyxYvOy7l/s5vyN4lTiHcY/wCJy+gjgkd26ATyB+S0sRivckI+zjALF11Suqveupm3Yyo0ATJJcdTII+HSOa9L/wBOu0tW6tX063idSAGcnVwI0zcyOfFYsXsx1VF0ddnsDpte+ru6THTVF40wPY9rhII9uRWLF5+ZtCsqFB2Ueh+iU0a0VSY481ixU9R0hUNbq6OWY1SDFie7zzqsWIy8BYoZfOqCHawoi7WNgsWIy7Dd0SgQs77VYsXQukFj3CKn5TtOaT4XdObUczcGT5LFiaXQYdi4avqAjQuKBuGZSVixKuhSW11BJRVXwkDcFYsSfkPBnNy2YKxYsWk2noLR/9k=",
  },
  {
    code: "TREE003",
    name: "Chuối",
    seed: "Chồi cây",
    harvestMethod: "Thu hoạch cuống",
    growthCycle: "Chu kỳ ngắn (9-12 tháng)",
    image:
      "data:image/jpeg;base64,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",
  },
];
const PlanManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      seasonId: "",
      startDate: null,
      endDate: null,
      zone: "",
      area: "",
      plot: "",
      row: "",
      growthStage: "",
      materials: [],
      equipment: [],
      pesticides: [],
    },
  });

  const nextStep = () => setActive((current) => Math.min(current + 1, 5));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  return (
    <Card withBorder radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới kế hoạch mùa vụ</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive} mb="lg">
        <Stepper.Step label="Bước 1" description="Thông tin mùa vụ" />
        <Stepper.Step label="Bước 2" description="Vùng Trồng" />
        <Stepper.Step label="Bước 3" description="Thông tin cây trồng" />
        <Stepper.Step label="Bước 4" description="Phân bổ giai đoạn & vật tư" />
        <Stepper.Step label="Bước 5" description="Xác nhận" />
        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              }
              w={200}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Thêm mới kế hoạch mùa vụ thành công
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Kế hoạch mùa vụ của bạn đã được tạo thành công. Bạn có thể xem lại
              thông tin chi tiết trong danh sách kế hoạch mùa vụ.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {active === 0 && (
          <Stack>
            <Select
              radius={4}
              label="Chọn mùa vụ"
              placeholder="Mùa Xuân 2025"
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              leftSection={<IconChristmasBall size={16} />}
              {...form.getInputProps("seasonId")}
            />
            <Stack>
              <Text fw={"500"} fz={14}>
                Danh sách chu kì sinh trưởng
              </Text>

              <Group align="flex-start">
                <Card withBorder w={300} h={200}>
                  <Stack>
                    <Select
                      radius={4}
                      searchable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      radius={4}
                      label="Danh sách giai đoạn sinh trưởng"
                      placeholder="Chọn giai đoạn sinh trưởng"
                      data={["Giai đoạn 1", "Giai đoạn 2"]}
                    />
                  </Stack>
                </Card>
                <Card withBorder w={300} h={200}>
                  <Stack>
                    <Select
                      radius={4}
                      searchable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      radius={4}
                      label="Danh sách giai đoạn sinh trưởng"
                      placeholder="Chọn giai đoạn sinh trưởng"
                      data={["Giai đoạn 1", "Giai đoạn 2"]}
                    />
                  </Stack>
                </Card>
              </Group>
            </Stack>
          </Stack>
        )}

        {active === 1 && (
          <Stack>
            <TextInput
              radius={4}
              label="Tìm kiếm vùng trồng"
              placeholder="Tìm kiếm vùng trồng"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("zone")}
            />
            <Scrollable h={250}>
              <Group gap="md" wrap="nowrap" align="flex-start">
                {zoneCards.map((area, index) => (
                  <ZoneCard key={area.code} {...area} isActive={index === 0} />
                ))}
              </Group>
            </Scrollable>
            <TextInput
              radius={4}
              label="Tìm kiếm khu vực"
              placeholder="Tìm kiếm khu vực"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("area")}
            />
            <Scrollable h={250}>
              <Group gap="md" align="flex-start">
                {areaCards.map((area, index) => (
                  <AreaCard key={area.code} {...area} isActive={index === 0} />
                ))}
              </Group>
            </Scrollable>
            <TextInput
              radius={4}
              label="Tìm kiếm lô"
              placeholder="Tìm kiếm lô"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("plot")}
            />
            <Scrollable h={250}>
              <Group gap="md">
                {lotCards.map((area) => (
                  <LotCard key={area.code} {...area} />
                ))}
              </Group>
            </Scrollable>
          </Stack>
        )}
        {active === 2 && (
          <Stack gap={"xs"}>
            <Text fw={500} fz={15}>
              Danh mục cây trồng (chọn một)
            </Text>
            <TextInput
              placeholder="Tìm kiếm danh mục cây"
              radius={4}
              leftSection={<IconSearch size={18} />}
            />
            <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
            <Text fw={500} fz={15}>
              Chọn cây trồng (chọn một)
            </Text>
            <TextInput
              placeholder="Tìm kiếm cây trồng"
              radius={4}
              leftSection={<IconSearch size={18} />}
            />
            <CropCards selected="1" plants={cropOptions} onSelect={() => {}} />
          </Stack>
        )}
        {active === 3 && (
          <Stack>
            {/* <Stack gap={"xs"}>
              <Select
                radius={4}
                label="Giai đoạn sinh trưởng"
                placeholder="Chọn giai đoạn"
                data={["Nảy mầm", "Sinh trưởng", "Ra hoa"]}
                leftSection={<IconPlant size={16} />}
                {...form.getInputProps("growthStage")}
              />

              <Stack pl={"md"} gap={"xs"}>
                <Title order={5}>Danh sách vật tư</Title>
                {form.values.materials.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Vật tư"
                      placeholder="Phân NPK"
                      data={["Phân NPK", "Vôi bột"]}
                      leftSection={<IconBox size={16} />}
                      {...form.getInputProps(`materials.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`materials.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddMaterial}
                  leftSection={<IconBox size={16} />}
                >
                  + Thêm vật tư
                </Button>

                <Title order={5}>Danh sách thiết bị</Title>
                {form.values.equipment.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thiết bị"
                      placeholder="Máy xịt"
                      data={["Máy xịt", "Bình tưới"]}
                      leftSection={<IconTool size={16} />}
                      {...form.getInputProps(`equipment.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`equipment.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddEquipment}
                  leftSection={<IconTool size={16} />}
                >
                  + Thêm thiết bị
                </Button>

                <Title order={5}>Danh sách thuốc BVTV</Title>
                {form.values.pesticides.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thuốc BVTV"
                      placeholder="Confidor"
                      data={["Confidor", "Radiant"]}
                      leftSection={<IconVaccine size={16} />}
                      {...form.getInputProps(`pesticides.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`pesticides.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddPesticide}
                  leftSection={<IconVaccine size={16} />}
                >
                  + Thêm thuốc BVTV
                </Button>
              </Stack>
            </Stack>
            <Stack gap={"xs"}>
              <Select
                radius={4}
                label="Giai đoạn sinh trưởng"
                placeholder="Chọn giai đoạn"
                data={["Nảy mầm", "Sinh trưởng", "Ra hoa"]}
                leftSection={<IconPlant size={16} />}
                {...form.getInputProps("growthStage")}
              />

              <Stack pl={"md"} gap={"xs"}>
                <Title order={5}>Danh sách vật tư</Title>
                {form.values.materials.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Vật tư"
                      placeholder="Phân NPK"
                      data={["Phân NPK", "Vôi bột"]}
                      leftSection={<IconBox size={16} />}
                      {...form.getInputProps(`materials.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`materials.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddMaterial}
                  leftSection={<IconBox size={16} />}
                >
                  + Thêm vật tư
                </Button>

                <Title order={5}>Danh sách thiết bị</Title>
                {form.values.equipment.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thiết bị"
                      placeholder="Máy xịt"
                      data={["Máy xịt", "Bình tưới"]}
                      leftSection={<IconTool size={16} />}
                      {...form.getInputProps(`equipment.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`equipment.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddEquipment}
                  leftSection={<IconTool size={16} />}
                >
                  + Thêm thiết bị
                </Button>

                <Title order={5}>Danh sách thuốc BVTV</Title>
                {form.values.pesticides.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thuốc BVTV"
                      placeholder="Confidor"
                      data={["Confidor", "Radiant"]}
                      leftSection={<IconVaccine size={16} />}
                      {...form.getInputProps(`pesticides.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`pesticides.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddPesticide}
                  leftSection={<IconVaccine size={16} />}
                >
                  + Thêm thuốc BVTV
                </Button>
              </Stack>
            </Stack> */}
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack>
                <Text fw={"bold"}>Chu kì 1</Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  <GrowthStageCard
                    stageName="Giai đoạn Nảy mầm"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                </SimpleGrid>
              </Stack>
            </Card>
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack>
                <Text fw={"bold"}>Chu kì 2</Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  <GrowthStageCard
                    stageName="Giai đoạn Nảy mầm"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                </SimpleGrid>
              </Stack>
            </Card>
          </Stack>
        )}
        {active === 4 && <ConfirmStep />}
        {active < 5 && (
          <Group justify="space-between" mt="xl">
            <Button
              radius={4}
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Quay lại
            </Button>
            {active < 4 ? (
              <Button radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep} type="submit" color="green">
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </form>
    </Card>
  );
};

export default PlanManagementMainAddPage;
