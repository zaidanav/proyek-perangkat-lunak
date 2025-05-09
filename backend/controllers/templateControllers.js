export const templateControllers = async (req, res) => {
    try {
      res.status(200).json({ message: "Status Ok" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };