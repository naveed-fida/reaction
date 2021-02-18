FactoryGirl.define do
  factory :list do
    board
    title { FFaker::Lorem.unique.words.join(" ") }
    position { rand(1_000_000) }
  end
end
