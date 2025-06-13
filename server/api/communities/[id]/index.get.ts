import Community from "~/server/models/Community";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }
  const community = await Community.findById(id).exec();
  if (!community) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: `Community with id: ${id} not found`,
    });
  }
  return community;
});
