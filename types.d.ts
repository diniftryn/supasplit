type User = {
  id: string | number;
  username: string;
  groupIds: [] | null;
};

type Group = {
  id: string | number;
  name: string;
  imageUrl: string;
  userIds: string[] | number[];
  expenseIds: string[] | number[];
};
