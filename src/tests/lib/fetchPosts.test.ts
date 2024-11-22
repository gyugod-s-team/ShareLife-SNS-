import { fetchPosts } from "@/lib/api/fetchPosts"
import { afterEach, describe, expect, it, jest } from "@jest/globals"

describe("fetchPosts", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should handle fetch errors correctly", async () => {
    // fetch를 모킹하여 에러 상황을 시뮬레이션
    global.fetch = jest.fn().mockImplementation(async () => {
      return {
        ok: false,
        json: async () => ({ error: "Some error" }),
      } as unknown as Response // 타입을 Response로 캐스팅
    }) as jest.MockedFunction<typeof fetch>

    await expect(fetchPosts()).rejects.toThrow("Some error")
  })

  it("should return posts and nextPage when fetch is successful", async () => {
    // fetch를 모킹하여 성공적인 응답을 시뮬레이션
    global.fetch = jest.fn().mockImplementation(async () => {
      return {
        ok: true,
        json: async () => [
          { id: 1, title: "Post 1" },
          { id: 2, title: "Post 2" },
        ],
      } as unknown as Response // 타입을 Response로 캐스팅
    }) as jest.MockedFunction<typeof fetch>

    const result = await fetchPosts(1)

    expect(result.data).toEqual([
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ])
    expect(result.nextPage).toBeUndefined()
  })
})
