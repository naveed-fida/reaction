FactoryGirl.define do
  factory :card do
    list
    title { FFaker::Lorem.unique.words.join(" ") }
    description { FFaker::Lorem.paragraph }
    position { rand(1_000_000) }
    completed false
  end
end
